import styled from 'styled-components';
import React from 'react';
import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import OptionMenu from './OptionMenu';
import { categories, contact, meeting } from 'components/_common/tags';
import { CategoryAtom, MeetingAtom, ContactAtom } from '../../recoil/Tags';

interface DropdownProps {
  type: string;
  selectedTag?: string;
  setCategory?: React.Dispatch<React.SetStateAction<string>>;
  // 수정 페이지인 경우 초기 선택 전달받기
  initialCategory?: string;
  initialContact?: string;
  initialMeeting?: string;
}

interface TagObject {
  [key: string]: string;
}

const Dropdown = (props: DropdownProps) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false); // 카테고리 선택창
  const [isContactOpen, setIsContactOpen] = useState(false); // 지원 방법 선택창
  const [isMeetingOpen, setIsMeetingOpen] = useState(false); // 대면/비대면 선택창

  const categoryInfo = useRecoilValue(CategoryAtom); // 카테고리 태그 정보 가져오기
  const meetingInfo = useRecoilValue(MeetingAtom); // 지원 방법 태그 정보 가져오기
  const contactInfo = useRecoilValue(ContactAtom); // 대면/비대면 태그 정보 가져오기

  // 선택 버튼을 누르면 태그 선택창이 열림
  const handleDropdownClick = (type: string) => {
    if (type === 'category') {
      setIsCategoryOpen(!isCategoryOpen);
    } else if (type === 'contact') {
      setIsContactOpen(!isContactOpen);
    } else if (type === 'meeting') {
      setIsMeetingOpen(!isMeetingOpen);
    }
  };

  // 태그 선택을 마치면 태그 선택창이 닫힘
  useEffect(() => {
    if (props.type === 'category') {
      setIsCategoryOpen(false);
    } else if (props.type === 'contact') {
      setIsContactOpen(false);
    } else if (props.type === 'meeting') {
      setIsMeetingOpen(false);
    }
  }, [
    categoryInfo.selectedTag,
    meetingInfo.selectedTag,
    contactInfo.selectedTag,
  ]);

  // 선택된 태그 이미지 화면에 나타내기
  const getSelectedTagImg = () => {
    // 태그 선택 후 형식
    const getTagImage = (object: TagObject, selectedTag: string) => {
      return (
        <SelectedTagWrapper>
          <i className="fas fa-chevron-down arrow-down" />
          <SelectedTag src={object[selectedTag]} />
        </SelectedTagWrapper>
      );
    };

    // 태그 선택 전 기본 형식
    const getDefault = () => {
      return (
        <span>
          <i className="fas fa-chevron-down arrow-down" />
          <span>선택</span>
        </span>
      );
    };

    let content;

    switch (props.type) {
      case 'category':
        // 초기 태그 이후에 선택된 태그
        const selectedCategoryTag = categoryInfo.isSelected
          ? getTagImage(categories, categoryInfo.selectedTag)
          : null;
        // 수정 페이지인 경우 초기 태그를 불러오고 그 이후에 선택한 태그도 반영되도록 함
        content =
          props.initialCategory && !categoryInfo.isSelected
            ? getTagImage(categories, props.initialCategory as string)
            : selectedCategoryTag || getDefault();
        break;
      case 'contact':
        const selectedContactTag = contactInfo.isSelected
          ? getTagImage(contact, contactInfo.selectedTag)
          : null;
        content =
          props.initialContact && !contactInfo.isSelected
            ? getTagImage(contact, props.initialContact as string)
            : selectedContactTag || getDefault();
        break;
      case 'meeting':
        const selectedMeetingTag = meetingInfo.isSelected
          ? getTagImage(meeting, meetingInfo.selectedTag)
          : null;
        content =
          props.initialMeeting && !meetingInfo.isSelected
            ? getTagImage(meeting, props.initialMeeting as string)
            : selectedMeetingTag || getDefault();
        break;
      default:
        content = '';
    }
    return content;
  };

  return (
    <DropdownWrapper>
      <DropdownSelect
        type="button"
        onClick={() => handleDropdownClick(props.type)}
        className={
          props.type === 'category'
            ? isCategoryOpen
              ? 'isOpen'
              : ''
            : props.type === 'contact'
            ? isContactOpen
              ? 'isOpen'
              : ''
            : isMeetingOpen
            ? 'isOpen'
            : ''
        }
      >
        {getSelectedTagImg()}
      </DropdownSelect>
      {props.type === 'category' && isCategoryOpen && (
        <OptionMenu type={props.type} />
      )}
      {props.type === 'contact' && isContactOpen && (
        <OptionMenu type={props.type} />
      )}
      {props.type === 'meeting' && isMeetingOpen && (
        <OptionMenu type={props.type} />
      )}
    </DropdownWrapper>
  );
};

export default Dropdown;

const DropdownWrapper = styled.div`
  position: relative;
`;

const DropdownSelect = styled.button`
  background-color: var(--gray);
  padding: 5px 20px;
  border-radius: 20px;
  font-size: 18px;
  white-space: nowrap;
  transition: opacity 200ms ease-in-out;

  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }

  &.isOpen {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.18);
    opacity: 1;
  }

  .arrow-down {
    font-size: 12px;
    margin-right: 7px;
    color: #948e8e;
  }

  .arrow-up {
    transform: rotate(180deg);
  }
`;

const SelectedTagWrapper = styled.div`
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 100ms ease-in-out;
  cursor: pointer;
`;

const SelectedTag = styled.img`
  width: 100px;
  height: 100%;
  object-fit: cover;
`;
