import styled from 'styled-components';
import React from 'react';
import { FixtureNamesByPath, FixtureId } from 'react-cosmos-shared2/renderer';
import { FixtureTree } from './FixtureTree';
import { TreeExpansion } from './shared';

type Props = {
  fixturesDir: string;
  fixtureFileSuffix: string;
  selectedFixtureId: null | FixtureId;
  rendererConnected: boolean;
  fixtures: FixtureNamesByPath;
  treeExpansion: TreeExpansion;
  selectFixture: (fixtureId: FixtureId, fullScreen: boolean) => void;
  setTreeExpansion: (treeExpansion: TreeExpansion) => unknown;
};

export function Nav({
  fixturesDir,
  fixtureFileSuffix,
  selectedFixtureId,
  rendererConnected,
  fixtures,
  treeExpansion,
  selectFixture,
  setTreeExpansion
}: Props) {
  const onSelect = React.useCallback(
    fixtureId => selectFixture(fixtureId, false),
    [selectFixture]
  );

  if (!rendererConnected) {
    return <Container />;
  }

  return (
    <Container data-testid="nav">
      <FixtureTree
        fixturesDir={fixturesDir}
        fixtureFileSuffix={fixtureFileSuffix}
        fixtures={fixtures}
        selectedFixtureId={selectedFixtureId}
        treeExpansion={treeExpansion}
        onSelect={onSelect}
        setTreeExpansion={setTreeExpansion}
      />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: var(--grey1);
  overflow: auto;
`;
