"use client";
import CommonTitle from "@/components/CommonTitle";
import Modal from "@/components/Modal";
import browserClient from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [name, setName] = useState("");
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const [openClose, setOpenClose] = useState<boolean>(false);
  const router = useRouter();

  const validateFields = () => {
    const errors: Record<string, string> = {};

    // 이메일 유효성 검사
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValid) {
      errors.email = "이메일 형식이 잘못되었습니다.";
    }

    // 비밀번호 유효성 검사
    const validatePassword = (password: string): boolean => {
      // 숫자 + 문자 + 특수문자를 포함하는 8자 이상 패턴
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return passwordRegex.test(password);
    };

    // 비밀번호 유효성 검사
    if (!validatePassword(password)) {
      errors.password = "비밀번호는 8자 이상, 영문과 숫자, 특수문자를 포함해야 합니다.";
    }

    // 비밀번호 확인 일치 여부 검사
    if (confirmPassword && password !== confirmPassword) {
      errors.confirmPassword = "비밀번호와 비밀번호 확인이 일치하지 않습니다.";
    }

    // 별명 유효성 검사
    if (nickname.length < 2) {
      errors.nickname = "별명은 2글자 이상이어야 합니다.";
    }

    // 각 필드별 오류 메세지 반환
    return errors;
  };

  // 회원가입 버튼을 클릭했을 때 호출되는 함수
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    const validationErrors = validateFields(); // 입력값 검사 실행
    setFieldError(validationErrors); // 각 필드별 오류 메세지 설정

    // 에러가 있으면 실행 중단
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // ** 데이터가 입력이 되면 로그인이 실행되고(이 때, 테이블에 추가가 되는것으로 작성하기) 회원가입2로 이동하도록 작성
    try {
      // Supabase에 회원 정보 추가 및 회원가입 요청
      const { data, error } = await browserClient.auth.signUp({
        email,
        password
      });

      if (error) {
        setFieldError((prevState) => ({
          ...prevState,
          general: error.message // Supabase 오류 메시지 설정
        }));

        if (error.message === "User already registered") {
          setFieldError((prevState) => ({
            ...prevState,
            general: "이미 가입 된 이메일 입니다." // Supabase 오류 메시지 설정
          }));
          return setOpenClose(true);
        }
      }

      // 회원가입 요청에 성공한 경우 실행
      if (data) {
        // 별명(nickname)을 포함한 데이터를 users 테이블에 추가
        const { error: dbError } = await browserClient.from("users").insert({
          email,
          nickname,
          name
        });

        // 데이터 베이스 삽입 중 오류가 발생한 경우 오류 메시지 설정 후 종료
        if (dbError) {
          console.error("회원가입 에러", dbError);
          setFieldError((prevState) => ({
            ...prevState, // 이전 상태 복사
            general: "회원 데이터 추가 중 오류가 발생했습니다." // 일반 오류 메시지 추가
          }));
          return;
        }

        // 회원가입이 완료되면 리디렉션으로 sign-up/profile로 이동
        router.push("/sign-up/profile");
      }
    } catch (error) {
      console.error("회원가입 중 오류 발생", error);
      setFieldError((prevState) => ({
        ...prevState,
        general: "회원가입 중 오류가 발생했습니다." // 회원가입 오류 메시지 설정
      }));
    }
  };

  return (
    <div className="flex flex-col min-h-screen mx-auto bg-background02 lg:max-w-screen-lg">
      <CommonTitle title="회원가입" />
      {/* 회원가입 폼 */}
      <form
        onSubmit={handleSignUp}
        className="flex-1 flex flex-col mt-4 px-4 pb-[22px] w-full max-w-[520px] mx-auto lg:pb-[140px] lg:mt-[66px]"
      >
        {/* 이메일 입력 */}
        <div className="mb-4">
          <label htmlFor="email" className="label-style">
            이메일
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // 입력시 상태 업데이트
            className="input-style"
            placeholder="이메일을 입력하세요"
          />
          {/* 다음으로 버튼 클릭 시, 이메일 유효성 경고 문구 */}
          {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email ? (
            <p className="mt-1 text-sm leading-normal text-gray04">사용하실 이메일 주소를 입력하세요.</p>
          ) : fieldError.email ? (
            <p className="text-sm leading-normal text-[#F2573B] mt-1">{fieldError.email}</p>
          ) : (
            <p className="mt-1 text-sm leading-normal text-gray04">사용하실 이메일 주소를 입력하세요.</p>
          )}
        </div>

        {/* 비밀번호 입력 */}
        <div className="mb-4">
          <label htmlFor="password" className="label-style">
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // 입력시 상태 업데이트
            className="input-style"
            placeholder="비밀번호를 입력하세요"
          />

          {/* 다음으로 버튼 클릭 시, 비밀번호 유효성 경고 문구 */}
          {fieldError.password ? (
            <p className="text-sm leading-normal text-[#F2573B] mt-1">{fieldError.password}</p>
          ) : password ? (
            <p className="mt-1 text-sm leading-normal text-gray04">
              안전한 비밀번호를 입력해주세요.(8자 이상의 영문, 숫자, 특수 문자 포함)
            </p>
          ) : (
            <p className="mt-1 text-sm leading-normal text-gray04">
              안전한 비밀번호를 입력해주세요(8자 이상의 영문, 숫자, 특수 문자 포함)
            </p>
          )}
        </div>

        {/* 비밀번호 확인 입력 */}
        <div className="mb-4">
          <label htmlFor="password" className="label-style">
            비밀번호 확인
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} // 입력시 상태 업데이트
            className="input-style"
            placeholder="비밀번호를 입력하세요"
          />

          {/* 다음으로 버튼 클릭 시, 비밀번호 확인 유효성 경고 문구 */}
          {password === confirmPassword && confirmPassword ? (
            <p className="text-[#2E5342] mt-1 text-sm leading-normal ">비밀번호가 일치합니다.</p>
          ) : fieldError.confirmPassword ? (
            <p className="text-[#F2573B] text-sm leading-normal ">{fieldError.confirmPassword}</p>
          ) : (
            <p
              className={`mt-1 text-sm leading-normal  ${
                confirmPassword === ""
                  ? "text-gray-400"
                  : password === confirmPassword
                  ? "text-[#2E5342]"
                  : "text-[#F2573B]"
              }`}
            >
              {confirmPassword === ""
                ? "위와 동일한 비밀번호를 입력해 주세요."
                : password === confirmPassword
                ? "비밀번호가 일치합니다."
                : "비밀번호가 일치하지 않습니다."}
            </p>
          )}
        </div>

        {/* 이름 입력 */}
        <div className="mb-4">
          <label htmlFor="name" className="label-style">
            이름
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)} // 입력시 상태 업데이트
            className="input-style"
            placeholder="이름을 입력하세요"
          />
          <p className="mt-1 text-sm leading-normal text-gray04">이름을 입력해 주세요.</p>
        </div>

        {/* 별명 입력 */}
        <div className="mb-4">
          <label htmlFor="nickname" className="label-style">
            별명
          </label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)} // 입력시 상태 업데이트
            className="input-style"
            placeholder="별명을 입력하세요"
          />

          {/* 다음으로 버튼 클릭 시, 별명 유효성 경고 문구 */}
          {fieldError.nickname && nickname.length < 2 ? (
            <p className="text-[#F2573B] mt-1 text-sm leading-normal ">{fieldError.nickname}</p>
          ) : nickname.length >= 2 ? (
            <p className="mt-1 text-sm leading-normal text-gray04">2글자 이상의 별명을 입력해 주세요.</p>
          ) : (
            <p className="mt-1 text-sm leading-normal text-gray04">2글자 이상의 별명을 입력해 주세요.</p>
          )}
        </div>

        {/* "다음으로" 버튼 */}
        <div className="flex justify-center mt-auto lg:mt-[74px]">
          <button
            type="submit"
            className="w-full py-4 bg-primary text-white rounded-lg text-sm leading-[1.35] hover:bg-primary lg:text-lg lg:font-medium"
          >
            다음으로
          </button>
        </div>
      </form>

      {/* 에러 메세지 출력 */}
      {openClose && <Modal mainText="안내" subText={fieldError.general} setModalState={setOpenClose} />}
    </div>
  );
}
