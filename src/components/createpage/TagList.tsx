import styled from 'styled-components';
import { useRecoilState } from 'recoil';

import { dev, language, daily, contact, meeting } from '../_common/tags';
import { CategoryAtom, MeetingAtom, ContactAtom } from '../../recoil/Tags';

type TagOptionProps = {
  type: 'dev' | 'lang' | 'daily' | 'contact' | 'meeting';
};

const TagList = ({ type }: TagOptionProps) => {
  const [categoryTag, setCategoryTag] = useRecoilState(CategoryAtom);
  const [meetingTag, setMeetingTag] = useRecoilState(MeetingAtom);
  const [contactTag, setContactTag] = useRecoilState(ContactAtom);

  let tagObject: { [key: string]: string } = {};

  switch (type) {
    case 'dev':
      tagObject = dev;
      break;
    case 'lang':
      tagObject = language;
      break;
    case 'daily':
      tagObject = daily;
      break;
    case 'contact':
      tagObject = contact;
      break;
    case 'meeting':
      tagObject = meeting;
      break;
    default:
      break;
  }

  const handleTagClick = (type: string, tag: string) => {
    if (type === 'contact') {
      setContactTag({ isSelected: true, selectedTag: tag });
    } else if (type === 'meeting') {
      setMeetingTag({ isSelected: true, selectedTag: tag });
    } else {
      setCategoryTag({ isSelected: true, selectedTag: tag });
    }
  };

  return (
    <>
      {Object.keys(tagObject).map((e, index) => (
        <TagWrapper key={index} onClick={() => handleTagClick(type, e)}>
          <Tag src={tagObject[e]} />
        </TagWrapper>
      ))}
    </>
  );
};

export default TagList;

export const TagWrapper = styled.div`
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  transition: opacity 100ms ease-in-out;
  cursor: pointer;

  &:hover {
    opacity: 0.6;
  }
`;

export const Tag = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
