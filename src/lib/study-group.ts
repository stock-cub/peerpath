export type StudyGroup = {
  id: string;
  name: string;
  topic: string;
  description: string;
  creator_id: string;
  is_private: boolean;
  invite_code: string | null;
  created_at: string;
};

export type StudyGroupMessage = {
  id: string;
  group_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};
