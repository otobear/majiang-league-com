<template>
  <div class="flex flex-col gap-8 rounded-lg bg-white p-8 shadow">
    <h1 class="text-2xl font-bold">成績入力</h1>

    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-4">
        <label class="text-lg font-semibold">大会</label>
        <RadioButton v-model="tournamentMode" inputId="existing" value="existing" />
        <label for="existing">既存の大会を選択</label>
        <RadioButton v-model="tournamentMode" inputId="new" value="new" />
        <label for="new">新しい大会を作成</label>
      </div>

      <div v-if="tournamentMode === 'existing'" class="flex gap-4">
        <Select
          v-model="selectedTournament"
          :options="tournaments"
          optionLabel="name"
          placeholder="大会を選択"
          class="w-full"
        />
      </div>

      <div v-else class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <label>大会名</label>
          <InputText v-model="newTournament.name" placeholder="第X回" />
        </div>
        <div class="flex flex-col gap-2">
          <label>サブタイトル</label>
          <InputText v-model="newTournament.subName" placeholder="プレ赤塚リーグ（仮）" />
        </div>
        <div class="flex flex-col gap-2">
          <label>日付</label>
          <Calendar v-model="newTournament.date" dateFormat="yy-mm-dd" />
        </div>
        <div class="flex flex-col gap-2">
          <label>会場</label>
          <InputText v-model="newTournament.location" placeholder="日本健康麻将協会五反田" />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-4">
        <label class="text-lg font-semibold">セッション</label>
        <Select v-model="sessionName" :options="sessionOptions" class="w-48" />
      </div>

      <div class="grid grid-cols-[2fr_1fr_1fr] items-center gap-4">
        <label class="font-semibold">プレイヤー</label>
        <label class="text-right font-semibold">素点</label>
        <label class="text-right font-semibold">順位点</label>

        <template v-for="(result, index) in gameResults" :key="index">
          <Select
            v-model="result.player"
            :options="players"
            optionLabel="name"
            filter
            placeholder="プレイヤーを選択"
            class="w-full"
          />
          <InputNumber v-model="result.gamePoint" :useGrouping="false" input-class="text-right" />
          <div class="px-3 py-2 text-right font-semibold">
            {{ result.tablePoint !== null ? result.tablePoint.toFixed(1) : '-' }}
          </div>
        </template>

        <label class="text-right font-semibold">供託</label>
        <InputNumber v-model="forfeitGamePoint" :useGrouping="false" input-class="text-right" class="w-32" />
      </div>
    </div>

    <div
      v-if="validationMessage"
      class="rounded-lg p-4"
      :class="{
        'bg-green-50 text-green-800': validationMessage.type === 'success',
        'bg-red-50 text-red-800': validationMessage.type === 'error',
        'bg-yellow-50 text-yellow-800': validationMessage.type === 'warning',
      }"
    >
      {{ validationMessage.text }}
    </div>

    <div class="flex gap-4">
      <Button @click="submitGame" label="成績保存" icon="pi pi-save" :disabled="!canSubmit" :loading="submitting" />
      <Button @click="resetForm" label="クリア" icon="pi pi-refresh" severity="secondary" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Button, Calendar, InputNumber, InputText, RadioButton, Select } from 'primevue'
import { fetchTournaments } from '@/entities/tournament'
import { fetchPlayerStatsList } from '@/entities/player'

type Player = {
  id: number
  name: string
}

type Tournament = {
  id: number
  name: string
  subName: string
  date: string
  location: string
}

type GameResult = {
  player: Player | null
  gamePoint: number | null
  tablePoint: number | null
}

type ValidationMessage = {
  type: 'success' | 'error' | 'warning'
  text: string
}

const tournamentMode = ref<'existing' | 'new'>('existing')
const tournaments = ref<Tournament[]>([])
const selectedTournament = ref<Tournament | null>(null)
const newTournament = ref({
  name: '',
  subName: '',
  date: new Date(),
  location: '',
})

const players = ref<Player[]>([])
const sessionName = ref()
const sessionOptions = ['1回戦', '2回戦', '3回戦', '4回戦']
const gameResults = ref<GameResult[]>([
  { player: null, gamePoint: null, tablePoint: null },
  { player: null, gamePoint: null, tablePoint: null },
  { player: null, gamePoint: null, tablePoint: null },
  { player: null, gamePoint: null, tablePoint: null },
])
const forfeitGamePoint = ref(0)
const validationMessage = ref<ValidationMessage | null>(null)
const submitting = ref(false)

const canSubmit = computed(() => {
  if (tournamentMode.value === 'existing' && !selectedTournament.value) return false
  if (tournamentMode.value === 'new' && (!newTournament.value.name || !newTournament.value.subName)) return false
  if (!sessionName.value) return false
  return gameResults.value.every((result) => result.player !== null && result.gamePoint !== null)
})

function validateGame() {
  const tablePoints = gameResults.value.map((r) => r.tablePoint)
  const gamePoints = gameResults.value.map((r) => r.gamePoint)
  const players = gameResults.value.map((r) => r.player?.name).filter(Boolean)

  const uniquePlayers = new Set(players)
  if (uniquePlayers.size !== players.length) {
    validationMessage.value = { type: 'error', text: '重複したプレイヤーがいます' }
    return
  }

  const totalTablePoints = tablePoints.reduce((sum, point) => (sum || 0) + (point || 0), 0) || 0
  if (Math.abs(totalTablePoints - 10) > 0.1) {
    validationMessage.value = {
      type: 'error',
      text: `順位点の合計は${totalTablePoints}ですが、10 になるべきです`,
    }
    return
  }

  const totalGamePoints = gamePoints.reduce((sum, point) => (sum || 0) + (point || 0), 0) || 0
  const expectedGamePointsTotal = totalGamePoints + forfeitGamePoint.value

  if (expectedGamePointsTotal !== 0) {
    validationMessage.value = {
      type: 'warning',
      text: `素点と供託の合計は ${totalGamePoints} ですが、0 になるべきです`,
    }
    return
  }

  validationMessage.value = { type: 'success', text: '対局データの検証が完了しました' }
}

async function submitGame() {
  if (!canSubmit.value) return

  submitting.value = true
  validationMessage.value = null

  try {
    let tournamentId: number

    if (tournamentMode.value === 'existing') {
      tournamentId = selectedTournament.value!.id
    } else {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/tournaments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTournament.value.name,
          sub_name: newTournament.value.subName,
          date: newTournament.value.date.toISOString().split('T')[0],
          location: newTournament.value.location,
        }),
      })

      if (!response.ok) throw new Error('大会の作成に失敗しました')
      const data = await response.json()
      tournamentId = data.id
    }

    const gameResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tournament_id: tournamentId,
        session_name: sessionName.value,
        forfeit_game_point: forfeitGamePoint.value || 0,
        player_results: gameResults.value.map((result) => ({
          player_id: result.player!.id,
          game_point: result.gamePoint || 0,
          table_point: result.tablePoint || 0,
        })),
      }),
    })

    if (!gameResponse.ok) throw new Error('成績入力に失敗しました')

    validationMessage.value = { type: 'success', text: '成績入力が完了しました！' }
    resetForm()
  } catch (error) {
    validationMessage.value = {
      type: 'error',
      text: error instanceof Error ? error.message : '入力に失敗しました',
    }
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  gameResults.value = [
    { player: null, gamePoint: null, tablePoint: null },
    { player: null, gamePoint: null, tablePoint: null },
    { player: null, gamePoint: null, tablePoint: null },
    { player: null, gamePoint: null, tablePoint: null },
  ]
  forfeitGamePoint.value = 0
  sessionName.value = null
  validationMessage.value = null
}

// 自动计算順位点和验证监听器
watch(
  [gameResults, forfeitGamePoint],
  () => {
    // 计算順位点
    calculateTablePoints()

    // 只有当所有玩家都选择了且有输入数据时才进行验证
    const hasAllPlayers = gameResults.value.every((result) => result.player !== null)
    const hasAllGamePoints = gameResults.value.every((result) => result.gamePoint !== null)
    if (hasAllPlayers && hasAllGamePoints) {
      validateGame()
    } else {
      validationMessage.value = null
    }
  },
  { deep: true }
)

// 计算順位点的函数
function calculateTablePoints() {
  // 检查是否所有的素点都已输入
  const allGamePointsEntered = gameResults.value.every((result) => result.gamePoint !== null)

  if (!allGamePointsEntered) {
    // 如果没有全部输入，清空順位点
    gameResults.value.forEach((result) => {
      result.tablePoint = null
    })
    return
  }

  // 复制结果并按素点排序（从高到低）
  const sortedResults = [...gameResults.value]
    .map((result, originalIndex) => ({ ...result, originalIndex }))
    .sort((a, b) => (b.gamePoint || 0) - (a.gamePoint || 0))

  // 分配順位点：1位=4点，2位=3点，3位=2点，4位=1点
  const tablePointsByRank = [4, 3, 2, 1]

  // 处理同分情况
  for (let i = 0; i < sortedResults.length; i++) {
    let rank = i + 1
    let sameScoreCount = 1

    // 查找同分的玩家数量
    for (let j = i + 1; j < sortedResults.length; j++) {
      if (sortedResults[j].gamePoint === sortedResults[i].gamePoint) {
        sameScoreCount++
      } else {
        break
      }
    }

    // 计算同分玩家的平均順位点
    let totalTablePoints = 0
    for (let k = 0; k < sameScoreCount; k++) {
      totalTablePoints += tablePointsByRank[i + k]
    }
    const averageTablePoint = totalTablePoints / sameScoreCount

    // 给同分玩家分配相同的順位点
    for (let k = 0; k < sameScoreCount; k++) {
      const originalIndex = sortedResults[i + k].originalIndex
      gameResults.value[originalIndex].tablePoint = averageTablePoint
    }

    // 跳过已处理的同分玩家
    i += sameScoreCount - 1
  }
}

onMounted(async () => {
  try {
    const tournamentsData = await fetchTournaments()
    if (tournamentsData) {
      tournaments.value = tournamentsData.map((t) => ({
        id: t.id, // 已经是number类型
        name: `${t.info.name} ${t.info.subName}`,
        subName: t.info.subName,
        date: t.info.date,
        location: t.info.location,
      }))
    }

    const playersData = await fetchPlayerStatsList()
    if (playersData) {
      players.value = playersData.map((p) => ({
        id: p.id,
        name: `${p.id} - ${p.name}`,
      }))
    }
  } catch (error) {
    console.error('Failed to load data:', error)
  }
})
</script>
