import styled from 'styled-components';

export const Container = styled.div`
  width: 73vw;
  margin: 0 auto;
  padding: 0 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Body = styled.div`
  width: calc(100% - 200px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
`;

export const Border = styled.div`
  height: 0;
  width: 100%;
  border-bottom: 1px #d9d9d9 solid;
`;
