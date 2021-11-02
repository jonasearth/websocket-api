import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import * as WebSocket from 'ws';
import { Server, Socket } from 'socket.io';
import { defaultCorsConfig } from '../config/cors/default-cors.config';
import { DeviceResponse } from './types/device.type';
import env from '../app.env';
import { TraccarIntegration } from './traccar.integration';
import {
  Device,
  Position,
  TraccarWebSocketReturn,
} from './types/traccar-web-socket-return.type';

@WebSocketGateway({ cors: defaultCorsConfig })
export class WebSocketEventsGateway {
  @WebSocketServer()
  private server: Server;

  private devices: DeviceResponse[] = [];

  private socket: Socket;

  private cookie: any;

  private logger: Logger = new Logger('AppGateway');

  // eslint-disable-next-line no-useless-constructor
  constructor(
    private httpService: HttpService,
    private traccarIntegration: TraccarIntegration,
  ) {
    this.startConn();
  }

  async startConn(): Promise<void> {
    const data = await this.traccarIntegration.getSession();
    this.cookie = data.headers['set-cookie'];
    this.client(env.WEB_SOCKET_TRACCAR_URL, [], {
      headers: {
        cookie: data.headers['set-cookie'],
      },
    });
  }

  emitTo(socketId: string, eventType: string, response: unknown): void {
    this.server.to(socketId).emit(eventType, response);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
    this.emitTo(client.id, 'message', this.devices);
  }

  async fetchDevices(positions: Position[]): Promise<Device[]> {
    const devicesId = positions.map((position) => position.deviceId);
    return this.traccarIntegration.getMultiDevices(devicesId, this.cookie);
  }

  putDevices(devices: Device[]): void {
    devices.forEach((device) => {
      const dev = this.devices.find((obj) => obj.uniqueid === device.uniqueId);

      if (dev) {
        if (dev.status !== device.status) {
          dev.status = device.status;
          if (dev.status !== 'online') {
            dev.connected_at = new Date();
          }
        }
        return;
      }
      this.devices.push({
        uniqueid: device.uniqueId,
        status: device.status,
        connected_at: device.status === 'online' ? new Date() : null,
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async client(
    url: string,
    protocols: string[],
    options: WebSocket.ClientOptions,
  ): Promise<void> {
    const ws = new WebSocket(url, protocols, options);

    ws.on('open', function open() {
      console.log('open');
    });

    ws.on('message', async (msg) => {
      const resp: TraccarWebSocketReturn = JSON.parse(
        msg.toString(),
      ) as TraccarWebSocketReturn;
      if (resp.devices) {
        this.putDevices(resp.devices);
        const data = resp.devices.map((device) => {
          return this.devices.find((dev) => dev.uniqueid === device.uniqueId);
        });

        console.log(resp.devices);
        this.server.emit('message', data);
      }
      if (resp.positions) {
        const devices = await this.fetchDevices(resp.positions);

        this.putDevices(devices);
        const data = devices.map((device) => {
          return this.devices.find((dev) => dev.uniqueid === device.uniqueId);
        });
        this.server.emit('message', data);
      }
    });

    ws.on('error', function error(a): void {
      console.log(a);
    });
  }
}
