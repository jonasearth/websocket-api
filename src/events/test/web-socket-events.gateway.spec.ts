import { Test } from '@nestjs/testing';
import { assert } from 'chai';
import { WebSocketEventsGateway } from '../web-socket-events.gateway';

describe('Events gateway', () => {
  let webSocketEventsGateway: WebSocketEventsGateway;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [WebSocketEventsGateway],
    }).compile();

    webSocketEventsGateway = module.get(WebSocketEventsGateway);
  });

  it('Should be defined', () => {
    assert.isDefined(webSocketEventsGateway);
  });

  it('Should emit an error to start-onboarding event', () => {
    const response = {
      statusCode: 400,
      error: 'Bad Request',
      message: 'Could not start onboarding',
    };

    try {
      webSocketEventsGateway.emitToStartOnboarding(
        'T9CqC-mChXrTHoFiAAAB',
        response,
      );
    } catch (error) {
      assert.instanceOf(error, TypeError);

      return;
    }

    throw Error('Expected an error to be thrown, but it was not');
  });
});
