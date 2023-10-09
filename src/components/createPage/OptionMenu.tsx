import styled from 'styled-components';
import React, { useState } from 'react';

import TagList from './TagList';

const OptionMenu = ({ type }: { type: 'category' | 'contact' | 'meeting' }) => {
  const [selectedTab, setSelectedTab] = useState('dev');

  let content;

  switch (type) {
    case 'category':
      content = (
        <CategoryWrapper>
          <TabOption>
            <Tab
              className={selectedTab === 'dev' ? 'active' : ''}
              onClick={() => setSelectedTab('dev')}
            >
              개발
            </Tab>
            <Tab
              className={selectedTab === 'lang' ? 'active' : ''}
              onClick={() => setSelectedTab('lang')}
            >
              어학
            </Tab>
            <Tab
              className={selectedTab === 'daily' ? 'active' : ''}
              onClick={() => setSelectedTab('daily')}
            >
              일상
            </Tab>
          </TabOption>
          <Border></Border>
          <CategoryTabListWrapper>
            {selectedTab === 'dev' && <TagList type="dev" />}
            {selectedTab === 'lang' && <TagList type="lang" />}
            {selectedTab === 'daily' && <TagList type="daily" />}
          </CategoryTabListWrapper>
        </CategoryWrapper>
      );
      break;
    case 'contact':
      content = <TagList type="contact" />;
      break;
    case 'meeting':
      content = <TagList type="meeting" />;
      break;
    default:
      content = null;
      break;
  }

  return (
    <Wrapper className={`${type === 'contact' ? 'box' : ''}`}>
      {content}
    </Wrapper>
  );
};

export default OptionMenu;

const Wrapper = styled.div`
  max-width: 750px;
  display: flex;
  background-color: var(--gray);
  border: 2px var(--light_pink) solid;
  border-radius: 8px;
  padding: 8px 10px;
  box-shadow: 0 4px 20px rgba(63, 65, 80, 0.3);

  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  z-index: 100;

  &.box {
    min-width: 235px;
    /* max-width: 400px; */

    flex-wrap: wrap;
  }
`;

const CategoryWrapper = styled.div``;

const CategoryTabListWrapper = styled.div`
  display: flex;
  padding-top: 10px;
`;

const TabOption = styled.ol`
  width: 100%;
  display: flex;
  padding-bottom: 5px;
`;

const Tab = styled.li`
  margin-right: 20px;
  cursor: pointer;

  &.active {
    font-weight: bold;
  }
`;

const Border = styled.div`
  height: 0;
  border-bottom: 3px var(--light_pink) solid;
  margin: 0 -10px;
`;
