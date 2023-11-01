export type Study = {
  postId: number;
  title: string;
  deadline: string;
  likes: number;
  view: number;
  category: string;
  userLiked: boolean;
  ads: boolean;
  recruitment: boolean;
};

export type StatusBtn = {
  onBtnChange: (selectedBtn: string) => void;
};

export type TagListProps = {
  tags: string[];
  onTagClick: (tag: string) => void;
};

export type ModalProps = {
  setIsModalOpen: (isModalOpen: boolean) => void;
};
