import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Platform,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  Keyboard,
} from "react-native";
import Slider from "@react-native-community/slider";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";

const statusBarHeight = StatusBar.currentHeight;
const KEY_GPT = "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";

export default function App() {
  const [city, setCity] = useState("");
  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(false);
  const [travel, setTravel] = useState("");

  async function handleGenate() {
    if (city === "") {
      Alert.alert("Atenção", "Informe a cidade de destino");
      return;
    }
    setTravel("");
    setLoading(true);
    Keyboard.dismiss();

    const prompt = `Crie um roteiro para uma viagem de exatos ${days.toFixed(0)}
    dias na cidade de ${city}, busque por lugares turisticos, lugares mais 
    visitados, seja preciso nos dias de estadia fornecidos e limite o roteiro 
    apenas na cidade fornecida. Forneça apenas em tópicos com nome do local onde ir em cada dia.`;

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEY_GPT}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 500,
        top_p: 1,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTravel(data.choices[0].message.content);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor="#F1F1F1"
      />
      <Text style={styles.heading}>Roteiros Fácil</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Cidade Destino</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Campo Grande, MS"
          value={city}
          onChangeText={(text) => setCity(text)}
        />

        <Text style={styles.label}>
          Tempo de estadia: <Text style={styles.days}>{days.toFixed(0)}</Text>{" "}
          dias
        </Text>

        <Slider
          minimumValue={1}
          maximumValue={7}
          minimumTrackTintColor="#009688"
          maximumTrackTintColor="#000000"
          value={days}
          onValueChange={(value) => setDays(value)}
        />
      </View>
      <Pressable style={styles.button} onPress={handleGenate}>
        <Text style={styles.buttonText}>Gerar Roteiro</Text>
        <MaterialIcons name="travel-explore" size={24} color="#fff" />
      </Pressable>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 24, marginTop: 4 }}
        style={styles.containerScroll}
        showsVerticalScrollIndicator={false}
      >
        {loading && (
          <View style={styles.content}>
            <Text style={styles.title}>Carregando roteiro...</Text>
            <ActivityIndicator size="large" color="#000000" />
          </View>
        )}
        {travel && (
          <View style={styles.content}>
            <Text style={styles.title}>Roteiro da Viagem 👇</Text>
            <Text>Roteiro Completo</Text>
            <Text>{travel}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
    paddingTop: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    paddingTop: Platform.OS === "android" ? statusBarHeight : 54,
  },
  form: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#94a3b8",
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
    marginBottom: 16,
  },
  days: {
    backgroundColor: "#f1f1f1",
  },
  button: {
    backgroundColor: "#FF5656",
    width: "90%",
    borderRadius: 8,
    flexDirection: "row",
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    width: "100%",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 14,
  },
  containerScroll: {
    width: "90%",
    marginTop: 8,
  },
});
