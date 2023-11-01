import { useState } from 'react';
import styled from 'styled-components';

import defaultProfile from '../../assets/defaultProfile.jpg';
import post from '../../assets/mypage/post-icon.svg';
import heart from '../../assets/mypage/heart-icon.svg';
import settings from '../../assets/mypage/settings-icon.svg';
import user from '../../assets/mypage/user-icon.svg';
import Welcome from './Welcome';
import StudyList from './StudyList';
import NicknameEditModal from './NicknameEditModal';

const MenuBar = () => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 작성한 글 or 좋아요한 글 클릭
  const handleMenuClick = (index: number) => {
    setActiveIndex(index);
  };

  // 프로필 수정 클릭
  const handleEditClick = () => {
    setActiveIndex(-1);
    setIsModalOpen(true);
  };

  // 로그아웃 클릭
  const handleLogoutClick = () => {
    // 로그아웃 api 추가
    setActiveIndex(-1);
  };

  const menuArr = [
    {
      menuTitle: (
        <ItemDiv
          onClick={() => handleMenuClick(0)}
          className={`${activeIndex === 0 && 'active'}`}
        >
          <div>
            <img src={post} />
            <p>작성한 글</p>
          </div>
        </ItemDiv>
      ),
      menuContent: <StudyList type="POST" />,
    },
    {
      menuTitle: (
        <ItemDiv
          onClick={() => handleMenuClick(1)}
          className={`${activeIndex === 1 && 'active'}`}
        >
          <div>
            <img src={heart} />
            <p>좋아요한 글</p>
          </div>
        </ItemDiv>
      ),
      menuContent: <StudyList type="LIKE" />,
    },
  ];
  return (
    <>
      <Div>
        <MenuDiv>
          <ItemDiv onClick={handleEditClick}>
            <div>
              <img src={settings} />
              <p>프로필 수정</p>
            </div>
          </ItemDiv>
          {menuArr.map((section) => {
            return section.menuTitle;
          })}
          <ItemDiv onClick={handleLogoutClick}>
            <div>
              <img src={user} />
              <p>로그아웃</p>
            </div>
          </ItemDiv>
        </MenuDiv>
        <UserDiv>
          <img src={defaultProfile} />
          <p>username</p>
        </UserDiv>
      </Div>
      {activeIndex === -1 ? <Welcome /> : menuArr[activeIndex].menuContent}
      {isModalOpen && <NicknameEditModal setIsModalOpen={setIsModalOpen} />}
    </>
  );
};

const Div = styled.div`
  width: 270px;
  height: 100vh;
  background-color: #ffe2e2;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  position: fixed;
  display: flex;
  flex-direction: column;
  p {
    font-size: 24px;
  }
`;

const MenuDiv = styled.div`
  width: 100%;
`;

const ItemDiv = styled.div`
  display: flex;
  width: 100%;
  height: 88px;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 199, 199, 0.5);
  }
  div {
    padding-left: 26px;
    display: flex;
    width: 100%;
  }
  img {
    width: 32px;
    margin-right: 34px;
  }
  p {
    width: 100%;
    margin: auto;
  }
  &.active {
    border-radius: 8px;
    background-color: #ffc7c7;
  }
`;

const UserDiv = styled.div`
  width: 270px;
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 25px;
  padding-left: 26px;
  cursor: default;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
  }
  p {
    margin-left: 24px;
    font-size: 24px;
  }
`;

export default MenuBar;
