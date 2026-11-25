import { useState, type FormEvent } from "react";

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Checkbox,
  Icon,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  Toast,
  toast,
} from "@/components/ui";
import { useLayoutClass } from "@/hooks/useLayoutClass";

type FieldErrors = {
  userId?: string;
  password?: string;
};

function LoginSample() {
  useLayoutClass("type2");

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saveId, setSaveId] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextErrors: FieldErrors = {};
    if (!userId.trim()) nextErrors.userId = "아이디를 입력해 주세요.";
    if (!password) nextErrors.password = "비밀번호를 입력해 주세요.";
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    // 샘플 페이지이므로 실제 요청 대신 토스트로 결과만 보여줍니다.
    toast(`${userId}님, 로그인되었습니다.${saveId ? " (아이디 저장)" : ""}`);
  };

  return (
    <div className="grid min-h-full place-items-center px-4 py-10">
      <Card className="w-full max-w-[400px]">
        <CardHeader className="justify-items-center gap-2 text-center">
          {/* logo.svg는 168x48 비율이라 width/height를 직접 지정합니다. */}
          <Icon name="logo" width={168} height={48} className="mb-2" />
          <h1 className="text-2xl font-bold text-font-b">로그인</h1>
          <p className="text-sm text-font-g">
            서비스 이용을 위해 계정 정보를 입력해 주세요.
          </p>
        </CardHeader>

        <CardContent className="mt-4">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-id" className="text-sm font-medium text-font-b">
                아이디
              </label>
              <InputGroup>
                <InputGroupAddon>
                  <Icon name="user-settings" />
                </InputGroupAddon>
                <InputGroupInput
                  id="login-id"
                  placeholder="아이디를 입력하세요"
                  autoComplete="username"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  aria-invalid={errors.userId ? true : undefined}
                  resetEnabled
                />
              </InputGroup>
              {errors.userId ? <FieldError message={errors.userId} /> : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-pw" className="text-sm font-medium text-font-b">
                비밀번호
              </label>
              <InputGroup>
                <InputGroupAddon>
                  <Icon name="identification-on" />
                </InputGroupAddon>
                <InputGroupInput
                  id="login-pw"
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력하세요"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={errors.password ? true : undefined}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    variant="text"
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? "숨기기" : "보기"}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              {errors.password ? <FieldError message={errors.password} /> : null}
            </div>

            <div className="flex items-center justify-between">
              <Checkbox
                checked={saveId}
                onCheckedChange={(checked) => setSaveId(checked === true)}
                label="아이디 저장"
              />
              <Button type="button" variant="text">
                <span className="text">비밀번호 찾기</span>
              </Button>
            </div>

            <Button type="submit" className="mt-2 w-full">
              로그인
            </Button>
          </form>
        </CardContent>

        <CardFooter className="mt-2 flex-col gap-3">
          <p className="text-sm text-font-g">아직 계정이 없으신가요?</p>
          <Button type="button" variant="outline" className="w-full">
            회원가입
          </Button>
        </CardFooter>
      </Card>

      <Toast />
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <p role="alert" className="flex items-center gap-1 text-[13px] text-red">
      <Icon name="error-warning-fill" size={14} className="text-red" />
      {message}
    </p>
  );
}

export { LoginSample };
export default LoginSample;
