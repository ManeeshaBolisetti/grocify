import { useSignUp } from "@clerk/expo";
import { Link } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { AuthInput, AuthScreen, LinkButton, PrimaryButton } from "@/components/auth-ui";

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [incompleteMessage, setIncompleteMessage] = useState<string>();

  const isFetching = fetchStatus === "fetching";
  const globalError = errors.global?.[0]?.message ?? incompleteMessage;

  const startOver = async () => {
    await signUp.reset();
    setCode("");
    setIncompleteMessage(undefined);
    setIsVerifying(false);
  };

  const handleSubmit = async () => {
    // Drop any stale attempt that still carries old Dashboard requirements
    await signUp.reset();
    setIncompleteMessage(undefined);

    const { error } = await signUp.password({ emailAddress, password });
    if (error) return;

    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) return;

    setIsVerifying(true);
  };

  const handleVerify = async () => {
    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) return;

    if (signUp.status === "complete") {
      await signUp.finalize();
    } else {
      setIncompleteMessage(
        `Sign-up needs more info: ${signUp.missingFields.join(", ") || signUp.status}. ` +
          "Make these optional in the Clerk Dashboard, then start over.",
      );
    }
  };

  if (isVerifying) {
    return (
      <AuthScreen title="Verify your email">
        <AuthInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={setCode}
          keyboardType="numeric"
          error={errors.fields.code?.message ?? globalError}
        />
        <PrimaryButton title="Verify" onPress={handleVerify} disabled={!code || isFetching} />
        <LinkButton title="I need a new code" onPress={() => signUp.verifications.sendEmailCode()} />
        <LinkButton title="Start over" onPress={startOver} />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen title="Sign up">
      <AuthInput
        label="Email address"
        autoCapitalize="none"
        autoComplete="email"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={setEmailAddress}
        keyboardType="email-address"
        error={errors.fields.emailAddress?.message}
      />
      <AuthInput
        label="Password"
        value={password}
        placeholder="Enter password"
        secureTextEntry
        onChangeText={setPassword}
        error={errors.fields.password?.message ?? globalError}
      />
      <PrimaryButton
        title="Sign up"
        onPress={handleSubmit}
        disabled={!emailAddress || !password || isFetching}
      />

      <View className="mt-3 flex-row items-center justify-center gap-1">
        <Text>Already have an account?</Text>
        <Link href="/sign-in">
          <Text className="font-semibold text-blue-600">Sign in</Text>
        </Link>
      </View>

      {/* Required for sign-up on Expo web when legacy bot protection is enabled */}
      <View nativeID="clerk-captcha" />
    </AuthScreen>
  );
}
