import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {NavigationProp, ParamListBase, useRoute} from '@react-navigation/native';
import {theme} from "../theme";
import api from '../services/api';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {formatDate} from "../utils/dateFormat";
import {capitalizeFirstLetter} from "../utils/capitalizeFirst";
import Toast from "react-native-toast-message";

type ConfigurarAcessoNavigationProp = NavigationProp<ParamListBase>;

type Props = {
  navigation: ConfigurarAcessoNavigationProp;
};

type DiaSemana = {
  id: number;
  nome: string;
  abreviado: string;
  selecionado: boolean;
  permission_id: number | null;
};

type IntervaloHorario = {
  id: number;
  dias: DiaSemana[];
  de: string;
  ate: string;
};

const diasDaSemanaInicial: DiaSemana[] = [
  {id: 1, nome: 'Domingo', abreviado: 'Dom', selecionado: false, permission_id: null},
  {id: 2, nome: 'Segunda-feira', abreviado: 'Seg', selecionado: false, permission_id: null},
  {id: 3, nome: 'Terça-feira', abreviado: 'Ter', selecionado: false, permission_id: null},
  {id: 4, nome: 'Quarta-feira', abreviado: 'Qua', selecionado: false, permission_id: null},
  {id: 5, nome: 'Quinta-feira', abreviado: 'Qui', selecionado: false, permission_id: null},
  {id: 6, nome: 'Sexta-feira', abreviado: 'Sex', selecionado: false, permission_id: null},
  {id: 7, nome: 'Sábado', abreviado: 'Sáb', selecionado: false, permission_id: null},
];

const ConfigurarAcesso: React.FC<Props> = ({navigation}) => {
  const [diasSelecionados, setDiasSelecionados] = useState<DiaSemana[]>(diasDaSemanaInicial);
  const [deTime, setDeTime] = useState<string>('');
  const [ateTime, setAteTime] = useState<string>('');
  const [mostrarDePicker, setMostrarDePicker] = useState<boolean>(false);
  const [mostrarAtePicker, setMostrarAtePicker] = useState<boolean>(false);
  const [intervalos, setIntervalos] = useState<IntervaloHorario[]>([]);
  const [diasReplicar, setDiasReplicar] = useState<DiaSemana[]>(diasDaSemanaInicial);
  const [keyData, setKeyData] = useState<any>(null);
  const route = useRoute();
  const {id}: any = route.params;

  useEffect(() => {
    const fetchChaves = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          console.error('Token não encontrado');
          return;
        }

        const response = await api.get(`/keys/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = response.data;
        setKeyData(data);

        console.log('data', data.permissions)
        const newIntervals = data.permissions.flatMap((item: any) => {
          return item.schedules.map((schedule: any) => ({
            id: item.id,
            dias: item.day_of_week,
            de: schedule?.entry,
            ate: schedule?.exit,
          }));
        });

        console.log('newIntervals', newIntervals);

        setIntervalos(newIntervals)

        const diasAtualizados = diasDaSemanaInicial.map((dia) => {
          const permission = data.permissions.find((perm: any) =>
            perm.day_of_week.toLowerCase() === dia.nome.toLowerCase()
          );
          return {
            ...dia,
            permission_id: permission ? permission.id : null,
          };
        });

        setDiasSelecionados(diasAtualizados);
        setDiasReplicar(diasAtualizados);

      } catch (error) {
        console.error('Erro ao buscar chaves:', error);
      }
    };

    fetchChaves();
  }, [id]);

  const onChangeDeTime = (event: any, selectedDate: Date | undefined) => {
    setMostrarDePicker(false);
    if (selectedDate) {
      const hora = selectedDate.getHours().toString().padStart(2, '0');
      const minuto = selectedDate.getMinutes().toString().padStart(2, '0');
      setDeTime(`${hora}:${minuto}`);
    }
  };

  const onChangeAteTime = (event: any, selectedDate: Date | undefined) => {
    setMostrarAtePicker(false);
    if (selectedDate) {
      const hora = selectedDate.getHours().toString().padStart(2, '0');
      const minuto = selectedDate.getMinutes().toString().padStart(2, '0');
      setAteTime(`${hora}:${minuto}`);
    }
  };

  const diasDaSemana = [
    {id: 1, nome: 'Domingo', abreviado: 'Dom', selecionado: false, english: 'sunday'},
    {id: 2, nome: 'Segunda-feira', abreviado: 'Seg', selecionado: false, english: 'monday'},
    {id: 3, nome: 'Terça-feira', abreviado: 'Ter', selecionado: false, english: 'tuesday'},
    {id: 4, nome: 'Quarta-feira', abreviado: 'Qua', selecionado: false, english: 'wednesday'},
    {id: 5, nome: 'Quinta-feira', abreviado: 'Qui', selecionado: false, english: 'thursday'},
    {id: 6, nome: 'Sexta-feira', abreviado: 'Sex', selecionado: false, english: 'friday'},
    {id: 7, nome: 'Sábado', abreviado: 'Sáb', selecionado: false, english: 'saturday'},
  ];

  const mapDayToPermissionId = (dayInPortuguese: any) => {
    if (!keyData || !keyData.permissions) {
      console.error('Dados da chave não carregados corretamente.');
      return null;
    }

    keyData.permissions.forEach((perm: any) => {
      console.log('Verificando permissão:', perm.day_of_week);
    });

    const permission = keyData.permissions.find(
      (perm: any) => {
        return perm.day_of_week === dayOfWeekTranslation(dayInPortuguese.english);
      }
    );

    return permission ? permission.id : null;
  };

  const dayOfWeekTranslation = (day: string) => {
    const daysInEnglish = {
      'sunday': 'domingo',
      'monday': 'segunda',
      'tuesday': 'terça',
      'wednesday': 'quarta',
      'thursday': 'quinta',
      'friday': 'sexta',
      'saturday': 'sabado',
    };

    // @ts-ignore
    return daysInEnglish[day.toLowerCase()] || null;
  };

  const adicionarIntervalo = async () => {
    const diasSelecionadosAtualizados = diasSelecionados.filter((dia) => dia.selecionado);

    if (diasSelecionadosAtualizados.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'Por favor, selecione pelo menos um dia da semana.',
        visibilityTime: 5000
      });
      return;
    }

    if (!deTime || !ateTime) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'Por favor, selecione os horários "De" e "Até".',
        visibilityTime: 5000
      });
      return;
    }

    if (deTime >= ateTime) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'O horário "De" deve ser menor que o horário "Até".',
        visibilityTime: 5000
      });
      return;
    }

    const novoIntervalo: IntervaloHorario = {
      id: intervalos.length + 1,
      dias: diasSelecionadosAtualizados,
      de: deTime,
      ate: ateTime,
    };

    setIntervalos([...intervalos, novoIntervalo]);

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error('Token não encontrado');
        return;
      }

      for (let dia of diasSelecionadosAtualizados) {
        const permissionId = mapDayToPermissionId(dia);

        if (permissionId) {
          const payload = {
            permission_id: permissionId,
            start_time: deTime,
            end_time: ateTime,
          };

          const response = await api.post('/schedules', payload, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.status === 201) {
            Toast.show({
              type: 'success',
              text1: 'Sucesso!',
              text2: `Horário adicionado com sucesso para o dia ${dia.nome}.`,
              visibilityTime: 5000
            });
          } else {
            Toast.show({
              type: 'error',
              text1: 'Erro!',
              text2: `Falha ao adicionar o horário para o dia ${dia.nome}.`,
              visibilityTime: 5000
            });
            console.error('Erro na resposta do servidor', response.status, response.data);
          }
        } else {
          console.warn(`Permission ID não encontrado para o dia ${dia.nome}.`);
        }
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: `Ocorreu um erro ao enviar os dados.`,
        visibilityTime: 5000
      });
      console.error(error);
    }

    // @ts-ignore
    setDiasSelecionados(diasDaSemana);
    setDeTime('');
    setAteTime('');
  };

  const replicarHorarios = async () => {
    const diasSelecionadosReplicar = diasReplicar.filter((dia) => dia.selecionado);

    if (diasSelecionadosReplicar.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: `Por favor, selecione pelo menos um dia para replicar os horários.`,
        visibilityTime: 5000
      });
      return;
    }

    if (intervalos.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'Não há intervalos para replicar.',
        visibilityTime: 5000
      });
      return;
    }

    try {
      for (let intervalo of intervalos) {
        for (let dia of diasSelecionadosReplicar) {
          if (dia.permission_id) {
            const payload = {
              permission_id: dia.permission_id,
              start_time: intervalo.de,
              end_time: intervalo.ate,
            };

            const token = await AsyncStorage.getItem('authToken');
            const response = await api.post('/schedules', payload, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });

            if (response.status !== 201) {
              Toast.show({
                type: 'error',
                text1: 'Erro!',
                text2: 'Falha ao replicar os horários.',
                visibilityTime: 5000
              });
              return;
            }
          }
        }
      }
      Toast.show({
        type: 'success',
        text1: 'Sucesso!',
        text2: 'Horários replicados com sucesso.',
        visibilityTime: 5000
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'Ocorreu um erro ao replicar os horários.',
        visibilityTime: 5000
      });
      console.error(error);
    }

    setDiasReplicar(diasDaSemanaInicial);
  };

  const formatarHorario = (dataString: string) => {
    const date = new Date(dataString);
    const horas = date.getHours().toString().padStart(2, '0');
    const minutos = date.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
  };

  const toggleSelecionarDia = (diaId: number, tipo: 'selecionar' | 'replicar') => {
    if (tipo === 'selecionar') {
      const novosDias = diasSelecionados.map((dia) =>
        dia.id === diaId ? {...dia, selecionado: !dia.selecionado} : {...dia, selecionado: false}
      );
      setDiasSelecionados(novosDias);
    } else {
      const novosDias = diasReplicar.map((dia) =>
        dia.id === diaId ? {...dia, selecionado: !dia.selecionado} : dia
      );
      setDiasReplicar(novosDias);
    }
  };

  const renderDiaSemana = (dia: DiaSemana, tipo: 'selecionar' | 'replicar') => (
    <TouchableOpacity
      key={dia.id}
      style={[
        styles.diaButton,
        dia.selecionado && styles.diaButtonSelecionado,
        tipo === 'replicar' && diasSelecionados.find((d) => d.id === dia.id && d.selecionado) && styles.diaButtonDesabilitado
      ]}
      onPress={() => toggleSelecionarDia(dia.id, tipo)}
      // @ts-ignore
      disabled={tipo === 'replicar' && diasSelecionados.find((d) => d.id === dia.id && d.selecionado)}
    >
      <Text style={[
        styles.diaButtonTexto,
        dia.selecionado && styles.diaButtonTextoSelecionado,
        tipo === 'replicar' && diasSelecionados.find((d) => d.id === dia.id && d.selecionado) && styles.diaButtonTextoDesabilitado
      ]}>
        {dia.abreviado}
      </Text>
    </TouchableOpacity>
  );

  const renderIntervalo = ({item}: { item: IntervaloHorario }) => (
    <View style={styles.intervaloCard}>
      <View style={styles.intervaloInfo}>
        <Text style={styles.intervaloDias}>
          {capitalizeFirstLetter(dayOfWeekTranslation(item.dias))}
        </Text>
        <Text style={styles.intervaloHorario}>
          <Text style={{fontWeight: 'bold'}}>Entrada: </Text>{formatarHorario(item.de)} - <Text style={{fontWeight: 'bold'}}>Saida: </Text>{formatarHorario(item.ate)}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.removerIntervalo}
        onPress={() => setIntervalos(intervalos.filter((intervalo) => intervalo.id !== item.id))}
      >
        <Ionicons name="trash" size={24} color="#E53935"/>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.sectionTitle}>Dias da Semana</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carrossel}>
          {diasSelecionados.map((dia) => renderDiaSemana(dia, 'selecionar'))}
        </ScrollView>

        <View style={styles.horarioContainer}>
          <TouchableOpacity style={styles.horarioInput} onPress={() => setMostrarDePicker(true)}>
            <Text style={deTime ? styles.horarioTexto : styles.horarioPlaceholder}>
              {deTime || 'De'}
            </Text>
            <Ionicons name="time" size={20} color="#777"/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.horarioInput} onPress={() => setMostrarAtePicker(true)}>
            <Text style={ateTime ? styles.horarioTexto : styles.horarioPlaceholder}>
              {ateTime || 'Até'}
            </Text>
            <Ionicons name="time" size={20} color="#777"/>
          </TouchableOpacity>
        </View>

        {mostrarDePicker && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            is24Hour
            display="default"
            onChange={onChangeDeTime}
          />
        )}

        {mostrarAtePicker && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            is24Hour
            display="default"
            onChange={onChangeAteTime}
          />
        )}

        <TouchableOpacity style={styles.adicionarButton} onPress={adicionarIntervalo}>
          <Ionicons name="add-circle" size={24} color="#4CAF50"/>
          <Text style={styles.adicionarButtonTexto}>Adicionar Intervalo</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Intervalos Liberados</Text>

        <FlatList
          data={intervalos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderIntervalo}
          style={styles.listaIntervalos}
          ListEmptyComponent={<Text style={styles.listaVazia}>Nenhum intervalo adicionado.</Text>}
          keyboardShouldPersistTaps="handled"
        />

        <Text style={styles.sectionTitle}>Replicar Horários</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carrossel}>
          {diasReplicar.map((dia) => renderDiaSemana(dia, 'replicar'))}
        </ScrollView>

        <TouchableOpacity style={styles.replicarButton} onPress={replicarHorarios}>
          <Ionicons name="copy" size={24} color="#4CAF50"/>
          <Text style={styles.replicarButtonTexto}>Replicar Horários</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 10,
    marginTop: 20,
  },
  carrossel: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  diaButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: theme.colors.cards,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  diaButtonSelecionado: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  diaButtonTexto: {
    fontSize: 16,
    color: theme.colors.primary,
  },
  diaButtonTextoDesabilitado: {
    color: '#999',
  },
  diaButtonDesabilitado: {
    backgroundColor: '#ccc',
    borderColor: '#ccc',
  },
  diaButtonTextoSelecionado: {
    color: '#fff',
    fontWeight: '600',
  },
  horarioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  horarioInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cards,
    borderRadius: 8,
    padding: 15,
    flex: 0.48,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  horarioPlaceholder: {
    fontSize: 16,
    color: '#777',
    flex: 1,
  },
  horarioTexto: {
    fontSize: 16,
    color: theme.colors.primary,
    flex: 1,
  },
  adicionarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cards,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  adicionarButtonTexto: {
    fontSize: 16,
    color: theme.colors.primary,
    marginLeft: 10,
    fontWeight: '600',
  },
  listaIntervalos: {
    marginBottom: 20,
    height: 300
  },
  intervaloCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cards,
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
  },
  intervaloInfo: {
    flex: 1,
  },
  intervaloDias: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  intervaloHorario: {
    fontSize: 14,
    color: '#777',
  },
  removerIntervalo: {
    padding: 5,
  },
  listaVazia: {
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
    marginTop: 10,
  },
  replicarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cards,
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  replicarButtonTexto: {
    fontSize: 16,
    color: theme.colors.primary,
    marginLeft: 10,
    fontWeight: '600',
  },
});

export default ConfigurarAcesso;
