"use client";

import Form from "@/components/diary/Form";
import { FetchData } from "@/utils/diary/FetchData";
import { useEffect, useState } from "react";

const initialData = {
  id: "",
  title: "",
  date: "",
  emotion: "",
  type: "",
  contents: "",
  draw: null,
  user_id: ""
};

const Modify = ({ params }: { params: { id: string } }) => {
  const [postData, setPostData] = useState(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const POST_ID = params.id;

  const getData = async () => {
    const DiaryData = await FetchData(POST_ID);
    setPostData({ ...postData, ...DiaryData });
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);
  return !isLoading && <Form POST_ID={POST_ID} initialData={postData} isModify={true} />;
};
export default Modify;
