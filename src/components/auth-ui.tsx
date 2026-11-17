import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  type TextInputProps,
} from "react-native";

export function AuthScreen({ title, children }: { title: string; children: ReactNode }) {
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-100"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center gap-3 p-5"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="mb-2 text-3xl font-bold">{title}</Text>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export function AuthInput({
  label,
  error,
  ...props
}: TextInputProps & { label?: string; error?: string }) {
  return (
    <>
      {label && <Text className="text-sm font-semibold">{label}</Text>}
      <TextInput
        className="rounded-lg border border-gray-300 bg-white p-3 text-base"
        placeholderTextColor="#666666"
        {...props}
      />
      {error && <Text className="text-xs text-red-600">{error}</Text>}
    </>
  );
}

export function PrimaryButton({
  title,
  onPress,
  disabled,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      className={`mt-2 items-center rounded-lg bg-blue-600 px-6 py-3 active:opacity-70 ${disabled ? "opacity-50" : ""}`}
      onPress={onPress}
      disabled={disabled}
    >
      <Text className="font-semibold text-white">{title}</Text>
    </Pressable>
  );
}

export function LinkButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable className="items-center py-3" onPress={onPress}>
      <Text className="font-semibold text-blue-600">{title}</Text>
    </Pressable>
  );
}
