import * as React from 'react';
import { map, isEqual } from 'lodash';
import styled from 'styled-components';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import {
  ChevronRightIcon,
  ChevronDownIcon,
  FolderIcon
} from '../../../shared/icons';
import { createUrl } from '../../../shared/url';
import { TreeExpansion } from '../shared';
import { FixtureNode } from './fixtureTree';

type Props = {
  node: FixtureNode;
  parents: string[];
  selectedFixtureId: null | FixtureId;
  treeExpansion: TreeExpansion;
  onSelect: (fixtureId: FixtureId) => unknown;
  onToggleExpansion: (nodePath: string, expanded: boolean) => unknown;
};

export function FixtureTreeNode({
  node,
  parents,
  treeExpansion,
  selectedFixtureId,
  onSelect,
  onToggleExpansion
}: Props) {
  const { items, dirs } = node;
  const nodePath = getNodePath(parents);
  const isRootNode = parents.length === 0;
  const isExpanded = isRootNode || treeExpansion[nodePath];

  const createSelectHandler = (fixtureId: FixtureId) => (
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    if (e.metaKey) {
      // Allow users to cmd+click to open fixtures in new tab
      window.open((e.currentTarget as HTMLAnchorElement).href, '_blank');
    } else {
      onSelect(fixtureId);
    }
  };

  return (
    <>
      {!isRootNode && (
        <DirButton onClick={() => onToggleExpansion(nodePath, !isExpanded)}>
          <ListItem indentLevel={parents.length - 1}>
            <CevronContainer>
              {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
            </CevronContainer>
            <FolderContainer>
              <FolderIcon />
            </FolderContainer>
            <Label>{parents[parents.length - 1]}</Label>
          </ListItem>
        </DirButton>
      )}
      {isExpanded && (
        <>
          {getSortedNodeDirNames(node).map(dirName => {
            const nextParents = [...parents, dirName];
            return (
              <FixtureTreeNode
                key={getNodePath(nextParents)}
                node={dirs[dirName]}
                parents={nextParents}
                treeExpansion={treeExpansion}
                selectedFixtureId={selectedFixtureId}
                onSelect={onSelect}
                onToggleExpansion={onToggleExpansion}
              />
            );
          })}
          {map(items, (fixtureId, fixtureName) => (
            <FixtureLink
              key={`${fixtureId.path}-${fixtureName}`}
              href={createUrl({ fixtureId })}
              onClick={createSelectHandler(fixtureId)}
            >
              <ListItem
                indentLevel={parents.length}
                selected={isEqual(fixtureId, selectedFixtureId)}
              >
                <FixtureLabel>{fixtureName}</FixtureLabel>
              </ListItem>
            </FixtureLink>
          ))}
        </>
      )}
    </>
  );
}

function getSortedNodeDirNames(node: FixtureNode): string[] {
  return (
    Object.keys(node.dirs)
      .slice()
      // Sort alphabetically first
      .sort()
      .sort((dirName1, dirName2) => {
        return (
          calcNodeDepth(node.dirs[dirName2]) -
          calcNodeDepth(node.dirs[dirName1])
        );
      })
  );
}

// Only differentiate between nodes with and without subdirs and ignore
// depth level in the latter
function calcNodeDepth(node: FixtureNode): 0 | 1 {
  const hasDirs = Object.keys(node.dirs).length > 0;
  return hasDirs ? 1 : 0;
}

const DirButton = styled.button`
  display: block;
  width: 100%;
  border: 0;
  background: transparent;

  :focus {
    outline: none;
    > span {
      box-shadow: inset 4px 0px 0 0 var(--primary3);
    }
  }

  ::-moz-focus-inner {
    border: 0;
  }
`;

const FixtureLink = styled.a`
  display: block;
  width: 100%;
  text-decoration: none;

  :focus {
    outline: none;
    > span {
      box-shadow: inset 4px 0px 0 0 var(--primary3);
    }
  }

  ::-moz-focus-inner {
    border: 0;
  }
`;

type ListItemProps = {
  indentLevel: number;
  selected?: boolean;
};

const ListItem = styled.span<ListItemProps>`
  --height: 28px;
  --hover-bg: hsl(var(--hue-primary), 19%, 21%);

  display: flex;
  flex-direction: row;
  align-items: center;
  height: var(--height);
  padding: 0 16px 0 ${props => getLeftPadding(props.indentLevel)}px;
  background: ${props => (props.selected ? 'var(--darkest)' : 'transparent')};
  color: ${props => (props.selected ? 'var(--grey6)' : 'var(--grey4)')};
  line-height: var(--height);
  user-select: none;
  cursor: default;
  transition: background var(--quick), color var(--quick);

  :hover {
    background: ${props =>
      props.selected ? 'var(--darkest)' : 'var(--hover-bg)'};
  }
`;

const Unshirinkable = styled.span`
  flex-shrink: 0;
`;

const Label = styled(Unshirinkable)`
  white-space: nowrap;
`;

const FixtureLabel = styled(Label)`
  padding-left: 16px;
`;

const IconContainer = styled(Unshirinkable)`
  --size: 16px;
  width: var(--size);
  height: var(--size);
  color: var(--grey3);
`;

const CevronContainer = styled(IconContainer)`
  padding-right: 2px;
  margin-left: -2px;
`;

const FolderContainer = styled(IconContainer)`
  padding-right: 6px;
`;

function getLeftPadding(depth: number) {
  return 8 + depth * 16;
}

function getNodePath(nodeParents: string[]) {
  return nodeParents.join('/');
}
