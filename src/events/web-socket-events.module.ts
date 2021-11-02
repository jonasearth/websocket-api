import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WebSocketEventsGateway } from './web-socket-events.gateway';
import { TraccarIntegration } from './traccar.integration';

@Module({
  imports: [HttpModule],
  providers: [WebSocketEventsGateway, TraccarIntegration],
  exports: [WebSocketEventsGateway, TraccarIntegration],
})
export class WebSocketEventsModule {}
