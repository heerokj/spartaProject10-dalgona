"use client";
import CommonTitle from "@/components/CommonTitle";
import Header from "@/components/layout/Header";
import useGetDevice from "@/hooks/useGetDevice";
import Image from "next/image";
import Link from "next/link";

const Complete = () => {
  const device = useGetDevice();

  return (
    <div className="flex flex-col min-h-dvh max-w-sm mx-auto bg-background02 lg:max-w-screen-lg">
      {device === "mobile" && <CommonTitle title="회원가입" />}
      {device === "pc" && <Header />}

      <div className="flex-1 flex flex-col gap-[10px] items-center justify-center text-center">
        <Image src={"/icons/complete.svg"} alt="회원가입 완료" width={250} height={170} />
        <div className="mt-5 text-lg leading-[1.35]">회원가입이 완료되었어요!</div>
        <span className="text-base leading-normal">달고나로 소중한 추억을 남겨볼까요?</span>
      </div>

      <div className="flex items-center justify-center">
        <Link
          href={"/main"}
          className="flex items-center justify-center mx-4 mb-[10px] py-[14.5px] rounded-lg min-w-max bg-primary text-white text-lg leading-[1.35] lg:mb-[243px] lg:w-[488px]"
        >
          일기 쓰러 가기
        </Link>
      </div>
    </div>
  );
};
export default Complete;
