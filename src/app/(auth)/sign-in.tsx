import { useSignIn } from "@clerk/expo";
import { Link } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { AuthInput, AuthScreen, LinkButton, PrimaryButton } from "@/components/auth-ui";

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const isFetching = fetchStatus === "fetching";

  const finalizeIfComplete = async () => {
    if (signIn.status === "complete") {
      await signIn.finalize();
    } else {
      console.error("Sign-in attempt not complete:", signIn.status);
    }
  };

  const handleSubmit = async () => {
    const { error } = await signIn.password({ emailAddress, password });
    if (error) return;

    if (signIn.status === "needs_client_trust") {
      const hasEmailCode = signIn.supportedSecondFactors?.some(
        (factor) => factor.strategy === "email_code",
      );
      if (hasEmailCode) await signIn.mfa.sendEmailCode();
      return;
    }

    await finalizeIfComplete();
  };

  const handleVerify = async () => {
    const { error } = await signIn.mfa.verifyEmailCode({ code });
    if (error) return;
    await finalizeIfComplete();
  };

  if (signIn.status === "needs_client_trust") {
    return (
      <AuthScreen title="Verify your account">
        <AuthInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={setCode}
          keyboardType="numeric"
          error={errors.fields.code?.message}
        />
        <PrimaryButton title="Verify" onPress={handleVerify} disabled={isFetching} />
        <LinkButton title="I need a new code" onPress={() => signIn.mfa.sendEmailCode()} />
        <LinkButton title="Start over" onPress={() => signIn.reset()} />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen title="Sign in">
      <AuthInput
        label="Email address"
        autoCapitalize="none"
        autoComplete="email"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={setEmailAddress}
        keyboardType="email-address"
        error={errors.fields.identifier?.message}
      />
      <AuthInput
        label="Password"
        value={password}
        placeholder="Enter password"
        secureTextEntry
        onChangeText={setPassword}
        error={errors.fields.password?.message}
      />
      <PrimaryButton
        title="Sign in"
        onPress={handleSubmit}
        disabled={!emailAddress || !password || isFetching}
      />

      <View className="mt-3 flex-row items-center justify-center gap-1">
        <Text>Don&apos;t have an account?</Text>
        <Link href="/sign-up">
          <Text className="font-semibold text-blue-600">Sign up</Text>
        </Link>
      </View>
    </AuthScreen>
  );
}
