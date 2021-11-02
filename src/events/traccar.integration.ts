import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import env from '../app.env';
import { Device } from './types/traccar-web-socket-return.type';

export class TraccarIntegration {
  // eslint-disable-next-line no-useless-constructor
  constructor(private httpService: HttpService) {}

  async getSession(): Promise<AxiosResponse> {
    this.httpService = new HttpService();
    const observable = this.httpService.get(
      `${env.HTTP_TRACCAR_URL}/session?token=${env.HTTP_TRACCAR_TOKEN}`,
    );

    const data = await firstValueFrom(observable);
    return data;
  }

  async getMultiDevices(devicesIds: number[], cookie: any): Promise<Device[]> {
    this.httpService = new HttpService();
    const devices = await Promise.all(
      devicesIds.map(async (id) => {
        const observable = this.httpService.get<Device[]>(
          `${env.HTTP_TRACCAR_URL}/devices?id=${id}`,
          {
            headers: {
              cookie,
            },
          },
        );
        const data = await firstValueFrom(observable);
        return data.data[0];
      }),
    );
    return devices;
  }
}
