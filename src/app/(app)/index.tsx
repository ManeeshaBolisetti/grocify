import { useAuth, useUser } from "@clerk/expo";
import { Text, View } from "react-native";
import { PrimaryButton } from "@/components/auth-ui";

export default function Index() {
  const { signOut } = useAuth();
  const { user } = useUser();

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-gray-100 p-5">
      <Text className="text-2xl font-bold">Welcome to Grocify</Text>
      <Text>{user?.primaryEmailAddress?.emailAddress}</Text>
      <PrimaryButton title="Sign out" onPress={() => signOut()} />
    </View>
  );
}
