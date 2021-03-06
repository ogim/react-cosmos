import { StateUpdater, Message } from 'react-cosmos-shared2/util';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { RendererId, FixtureNamesByPath } from 'react-cosmos-shared2/renderer';

export type RendererCoreSpec = {
  name: 'rendererCore';
  state: {
    connectedRendererIds: RendererId[];
    primaryRendererId: null | RendererId;
    fixtures: FixtureNamesByPath;
    fixtureState: FixtureState;
  };
  methods: {
    getConnectedRendererIds(): RendererId[];
    getPrimaryRendererId(): null | RendererId;
    getFixtures(): FixtureNamesByPath;
    getFixtureState(): FixtureState;
    isRendererConnected(): boolean;
    isValidFixtureSelected(): boolean;
    setFixtureState(stateUpdater: StateUpdater<FixtureState>): void;
    selectPrimaryRenderer(primaryRendererId: RendererId): void;
    receiveResponse(msg: Message): void;
  };
  events: {
    request: (msg: Message) => void;
    response: (msg: Message) => void;
  };
};
