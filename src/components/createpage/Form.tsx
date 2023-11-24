import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import Dropdown from './Dropdown';
import { Border } from 'components/_common/pageLayout';
import { CategoryAtom, MeetingAtom, ContactAtom } from '../../recoil/Tags';
import { Study } from 'components/_common/props';

import { createPost } from 'api/create';
import { editPost } from 'api/edit';

const initialDate = {
  year: 0,
  month: 0,
  day: 0,
};

interface dateType {
  year: number;
  month: number;
  day: number;
}

// props X -> 작성 페이지
// props O -> 수정 페이지
const Form = ({ edit }: { edit?: Study }) => {
  const { postId } = useParams();
  const postIdAsNumber = postId ? parseInt(postId) : 0;

  const navigate = useNavigate();

  // 선택된 태그 불러오기
  const categoryTag = useRecoilValue(CategoryAtom);
  const meetingTag = useRecoilValue(MeetingAtom);
  const contactTag = useRecoilValue(ContactAtom);

  // 작성 내용 저장
  const [title, setTitle] = useState('');
  const [people, setPeople] = useState(0);
  const [deadline, setDeadline] = useState(initialDate);
  const [startDate, setStartDate] = useState(initialDate);
  const [endDate, setEndDate] = useState(initialDate);
  const [content, setContent] = useState('');

  // 작성된 날짜를 POST API에 맞는 형식으로 변경한 값
  const [formattedDeadline, setFormattedDeadline] = useState('');
  const [formattedStartDate, setFormattedStartDate] = useState('');
  const [formattedEndDate, setFormattedEndDate] = useState('');

  // 변경 전 날짜를 년, 월, 일 단위로 쪼개서 저장
  const splitDate = (dateString: string) => {
    const dateObject = new Date(dateString);

    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1;
    const day = dateObject.getDate();

    return { year, month, day };
  };
  // 수정 페이지 -> 초기 작성 내용을 불러옴
  const initialDeadline = splitDate(edit?.deadLine as string);
  const initialStartDate = splitDate(edit?.startDate as string);
  const initialEndDate = splitDate(edit?.endDate as string);
  const initialTitle = edit?.title as string;
  const initialContent = edit?.content as string;
  const initialPeople = edit?.people as number;
  const initialCategory = edit?.category as string;
  const initialContact = edit?.contact as string;
  const initialMeeting = edit?.meeting as string;

  // 제목 저장
  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // 모집 인원 저장
  const onChangePeople = (e: React.ChangeEvent<HTMLInputElement>) => {
    const peopleAsNum = parseInt(e.target.value);
    setPeople(peopleAsNum);
  };

  // 글 작성 내용 저장
  const onChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // 날짜 저장 공통 함수
  const handleDateChange = (
    className: string,
    value: string,
    setDateFunc: any,
  ) => {
    setDateFunc((prevState: []) => ({
      ...prevState,
      [className]: parseInt(value),
    }));
  };

  // 모집 마감일 저장
  const onDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { className, value } = e.target;

    if (className.includes('year')) {
      handleDateChange('year', value, setDeadline);
    } else if (className.includes('month')) {
      handleDateChange('month', value, setDeadline);
    } else if (className.includes('day')) {
      handleDateChange('day', value, setDeadline);
    }
  };

  // 스터디 시작 날짜 저장
  const onStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { className, value } = e.target;
    if (className.includes('year')) {
      handleDateChange('year', value, setStartDate);
    } else if (className.includes('month')) {
      handleDateChange('month', value, setStartDate);
    } else if (className.includes('day')) {
      handleDateChange('day', value, setStartDate);
    }
  };

  // 스터디 끝 날짜 저장
  const onEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { className, value } = e.target;
    if (className.includes('year')) {
      handleDateChange('year', value, setEndDate);
    } else if (className.includes('month')) {
      handleDateChange('month', value, setEndDate);
    } else if (className.includes('day')) {
      handleDateChange('day', value, setEndDate);
    }
  };

  // 저장된 날짜 형식을 POST와 PUT API에 맞는 형식으로 변환
  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(
      2,
      '0',
    )} 00:00:00`;
  };

  useEffect(() => {
    const formattedDeadline = formatDate(
      deadline.year,
      deadline.month,
      deadline.day,
    );
    const formattedStartDate = formatDate(
      startDate.year,
      startDate.month,
      startDate.day,
    );
    const formattedEndDate = formatDate(
      endDate.year,
      endDate.month,
      endDate.day,
    );

    setFormattedDeadline(formattedDeadline);
    setFormattedStartDate(formattedStartDate);
    setFormattedEndDate(formattedEndDate);
  }, [deadline, startDate, endDate]);

  // 수정 페이지 -> 날짜 수정 함수
  // 년, 월, 일 중 하나라도 변경된 경우
  const handleEditDate = (dateType: dateType, initialDateType: dateType) => {
    return dateType.year !== 0
      ? formatDate(
          dateType.year,
          dateType.month || initialDateType.month,
          dateType.day || initialDateType.day,
        )
      : formatDate(
          initialDateType.year,
          dateType.month || initialDateType.month,
          dateType.day || initialDateType.day,
        );
  };

  // 완료 버튼 클릭 시
  // 작성 페이지인 경우 edit에 false를 전달받고 수정 페이지인 경우 edit에 true를 전달받음
  const handleSubmit = (edit: boolean) => {
    // 수정을 안 한 경우 -> 기존에 썼던 정보를 다시 제출
    // 수정을 한 경우 -> 수정된 정보를 제출
    const formData = {
      title: edit ? (title !== '' ? title : initialTitle) : title,
      content: edit ? (content !== '' ? content : initialContent) : content,
      deadLine: edit
        ? formattedDeadline !== '0-00-00 00:00:00'
          ? // 년, 월, 일 중 하나라도 변경된 경우
            handleEditDate(deadline, initialDeadline)
          : // 년, 월, 일 중 하나도 변경되지 않은 경우
            formatDate(
              initialDeadline.year,
              initialDeadline.month,
              initialDeadline.day,
            )
        : formattedDeadline,
      startDate: edit
        ? formattedStartDate !== '0-00-00 00:00:00'
          ? handleEditDate(startDate, initialStartDate)
          : formatDate(
              initialStartDate.year,
              initialStartDate.month,
              initialStartDate.day,
            )
        : formattedStartDate,
      endDate: edit
        ? formattedEndDate !== '0-00-00 00:00:00'
          ? handleEditDate(endDate, initialEndDate)
          : formatDate(
              initialEndDate.year,
              initialEndDate.month,
              initialEndDate.day,
            )
        : formattedEndDate,
      people: edit ? (people !== 0 ? people : initialPeople) : people,
      category: edit
        ? categoryTag.selectedTag !== ''
          ? categoryTag.selectedTag
          : initialCategory
        : categoryTag.selectedTag,
      meeting: edit
        ? meetingTag.selectedTag !== ''
          ? meetingTag.selectedTag
          : initialMeeting
        : meetingTag.selectedTag,
      contact: edit
        ? contactTag.selectedTag !== ''
          ? contactTag.selectedTag
          : initialContact
        : contactTag.selectedTag,
    };

    {
      edit
        ? editPost(postIdAsNumber, formData).then((res) => {
            // 스터디 내용 수정 PUT API
            console.log(res);
            console.log(postIdAsNumber, formData);
            navigate(`/detail/${postIdAsNumber}`);
          })
        : createPost(formData).then((res) => {
            //스터디 작성 내용 POST API
            console.log(formData);
            alert('모집글 작성이 완료되었습니다!');
          });
    }
    navigate(`/`);
  };

  return (
    <Wrapper>
      <Title
        type="text"
        placeholder="제목을 입력하세요"
        value={title || initialTitle}
        onChange={onChangeTitle}
        required
      />
      <Border />
      <MainWrapper>
        <MainLeft>
          <InputList>
            <InputListItem>
              <InputListTitle className="default">카테고리</InputListTitle>
              <Dropdown type="category" initialCategory={initialCategory} />
            </InputListItem>
            <InputListItem>
              <InputListTitle className="default">모집 마감</InputListTitle>
              <DateSelect>
                <DateInput
                  type="number"
                  className="year"
                  onChange={onDeadlineChange}
                  value={deadline.year || initialDeadline.year}
                  min="2023"
                  required
                />
                <p>년</p>
                <DateInput
                  type="number"
                  className="month"
                  onChange={onDeadlineChange}
                  value={deadline.month || initialDeadline.month}
                  min="1"
                  max="12"
                  required
                />
                <p>월</p>
                <DateInput
                  type="number"
                  className="day"
                  onChange={onDeadlineChange}
                  value={deadline.day || initialDeadline.day}
                  min="1"
                  max="31"
                  required
                />
                <p>일</p>
              </DateSelect>
            </InputListItem>
            <InputListItem>
              <InputListTitle className="short">스터디 기간</InputListTitle>
              <DateSelect>
                <DateInput
                  type="number"
                  className="year start"
                  onChange={onStartDateChange}
                  value={startDate.year || initialStartDate.year}
                  min="2023"
                  required
                />
                <p>년</p>
                <DateInput
                  type="number"
                  className="month start"
                  onChange={onStartDateChange}
                  value={startDate.month || initialStartDate.month}
                  min="1"
                  max="12"
                  required
                />
                <p>월</p>
                <DateInput
                  type="number"
                  className="day start"
                  onChange={onStartDateChange}
                  value={startDate.day || initialStartDate.day}
                  min="1"
                  max="31"
                  required
                />
                <p>일</p>
                <p> ~ </p>
                <DateInput
                  type="number"
                  className="year end"
                  onChange={onEndDateChange}
                  value={endDate.year || initialEndDate.year}
                  min="2023"
                  required
                />
                <p>년</p>
                <DateInput
                  type="number"
                  className="month end"
                  onChange={onEndDateChange}
                  value={endDate.month || initialEndDate.month}
                  min="1"
                  max="12"
                  required
                />
                <p>월</p>
                <DateInput
                  type="number"
                  className="day end"
                  onChange={onEndDateChange}
                  value={endDate.day || initialEndDate.day}
                  min="1"
                  max="31"
                  required
                />
                <p>일</p>
              </DateSelect>
            </InputListItem>
            <InputListItem className="last">
              <InputListTitle className="default">모집 인원</InputListTitle>
              <NumInput
                type="number"
                onChange={onChangePeople}
                value={people || initialPeople}
                min="1"
                required
              />
              <p>명</p>
            </InputListItem>
          </InputList>
        </MainLeft>

        <MainRight>
          <InputList>
            <InputListItem>
              <InputListTitle className="default">지원 방법</InputListTitle>
              <Dropdown type="contact" initialContact={initialContact} />
            </InputListItem>
            <InputListItem>
              <InputListTitle className="short">대면/비대면</InputListTitle>
              <Dropdown type="meeting" initialMeeting={initialMeeting} />
            </InputListItem>
          </InputList>
        </MainRight>
      </MainWrapper>
      <Border />
      <TextInput
        placeholder="내용을 입력하세요"
        onChange={onChangeContent}
        value={content || initialContent}
        wrap="hard"
        required
      />
      <Footer>
        <CompleteButton
          type="submit"
          onClick={() => (edit ? handleSubmit(true) : handleSubmit(false))}
        >
          완료
        </CompleteButton>
      </Footer>
    </Wrapper>
  );
};

export default Form;

const Wrapper = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.input`
  width: 300px;
  border-bottom: 1px #d9d9d9 solid;
  font-size: 30px;
  text-align: center;
  margin-top: 30px;
  margin-bottom: 80px;

  &:focus {
    border-color: pink;
  }
`;

const MainWrapper = styled.div`
  width: 85%;
  display: flex;
  justify-content: space-between;
  padding: 30px 0;
`;

const MainLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

const MainRight = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputList = styled.ol``;

const InputListItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 50px;
  font-size: 18px;

  &.last {
    margin-bottom: 0;
  }
`;

const InputListTitle = styled.li`
  white-space: nowrap;

  &.default {
    margin-right: 35px;
  }

  &.short {
    margin-right: 20px;
  }
`;

const DateSelect = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;

  p {
    margin-right: 8px;
  }
`;

const DateInput = styled.input`
  background-color: var(--gray);
  border-radius: 5px;
  height: 26px;
  font-size: 18px;
  text-align: center;

  &.year {
    width: 60px;
  }

  &.month,
  &.day {
    width: 40px;
  }
`;

const NumInput = styled.input`
  background-color: var(--gray);
  border-radius: 5px;
  height: 26px;
  width: 40px;
  font-size: 18px;
  text-align: center;
`;

const TextInput = styled.textarea`
  width: 100%;
  height: 200px;
  padding: 20px;
  font-size: 20px;
  text-align: left;
  position: relative;
  resize: none;

  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const Footer = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
`;

const CompleteButton = styled.button`
  width: 100px;
  height: 38px;
  border: 2px solid var(--navy);
  border-radius: 20px;
  background-color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 200ms ease-in-out color 200ms ease-in-out;

  &:hover {
    background-color: var(--navy);
    color: white;
  }
`;
