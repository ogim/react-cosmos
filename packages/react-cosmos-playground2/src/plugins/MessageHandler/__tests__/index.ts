import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { RENDERER_MESSAGE_EVENT_NAME } from 'react-cosmos-shared2/renderer';
import {
  BuildErrorMessage,
  SERVER_MESSAGE_EVENT_NAME
} from 'react-cosmos-shared2/build';
import { cleanup } from '../../../testHelpers/plugin';
import * as pluginMocks from '../../../testHelpers/pluginMocks';
import { mockSocketIo } from '../testHelpers/mockSocketIo';
import { register } from '..';

afterEach(cleanup);

function mockCore() {
  pluginMocks.mockCore({
    isDevServerOn: () => true
  });
}

it('emits renderer request externally', async () => {
  register();
  mockCore();
  loadPlugins();

  const selectFixtureReq = {
    type: 'selectFixture',
    payload: {
      rendererId: 'mockRendererId',
      fixtureId: { path: 'mockFixturePath', name: null },
      fixtureState: {}
    }
  };
  const messageHandler = pluginMocks.getMessageHandlerMethods();
  messageHandler.postRendererRequest(selectFixtureReq);

  await mockSocketIo(async ({ emit }) => {
    await wait(() =>
      expect(emit).toBeCalledWith(RENDERER_MESSAGE_EVENT_NAME, selectFixtureReq)
    );
  });
});

it('emits renderer response internally', async () => {
  register();
  mockCore();
  loadPlugins();

  await mockSocketIo(async ({ fakeEvent }) => {
    const rendererReadyRes = {
      type: 'rendererReady',
      payload: {
        rendererId: 'mockRendererId',
        fixtures: { 'ein.js': null, 'zwei.js': null, 'drei.js': null }
      }
    };

    const rendererResponse = jest.fn();
    pluginMocks.onMessageHandler({ rendererResponse });
    fakeEvent(RENDERER_MESSAGE_EVENT_NAME, rendererReadyRes);

    await wait(() =>
      expect(rendererResponse).toBeCalledWith(
        expect.any(Object),
        rendererReadyRes
      )
    );
  });
});

it('emits server message internally', async () => {
  register();
  mockCore();
  loadPlugins();

  await mockSocketIo(async ({ fakeEvent }) => {
    const buildErrorMsg: BuildErrorMessage = {
      type: 'buildError'
    };

    const serverMessage = jest.fn();
    pluginMocks.onMessageHandler({ serverMessage });
    fakeEvent(SERVER_MESSAGE_EVENT_NAME, buildErrorMsg);

    await wait(() =>
      expect(serverMessage).toBeCalledWith(expect.any(Object), buildErrorMsg)
    );
  });
});
