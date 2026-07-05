// Demo Scene Templates
// Public-safe edition: 3 simplified scenes.
// Production has 40+ scenes across 8 categories — not included here.

export type SceneCategory = 'power_fantasy' | 'transmigration' | 'sci_fi_trial'

export interface SceneTemplate {
  id: string
  category: SceneCategory
  title: string
  opening: string  // trigger prompt for LLM
}

export const SCENE_TEMPLATES: SceneTemplate[] = [
  {
    id: 'power_1',
    category: 'power_fantasy',
    title: '突然無敵',
    opening: '你剛剛還是個普通人，但現在，你感受到一股前所未有的力量在體內湧動。你低頭看著自己的手，發現它正在發光。你會怎麼做？',
  },
  {
    id: 'transmigration_1',
    category: 'transmigration',
    title: '醒來在異世',
    opening: '你睜開眼，發現自己躺在一張雕花木床上。房間裡的一切都是古代的樣式——屏風、銅鏡、還有桌上的一封書信。你意識到，你穿越了。你會先做什麼？',
  },
  {
    id: 'scifi_1',
    category: 'sci_fi_trial',
    title: '星際法庭',
    opening: '你被傳喚到星際法庭。法官盯著你，三隻眼睛同時眨了一下。「你被指控在第七區段違反了時間流動法。」你根本不知道他們在說什麼。你要如何為自己辯護？',
  },
]

export const CATEGORY_NAMES: Record<SceneCategory, { zh: string; en: string }> = {
  power_fantasy: { zh: '無敵流', en: 'Power Fantasy' },
  transmigration: { zh: '穿越', en: 'Transmigration' },
  sci_fi_trial: { zh: '星際法庭', en: 'Sci-Fi Trial' },
}

export function pickRandomTemplate(): SceneTemplate {
  return SCENE_TEMPLATES[Math.floor(Math.random() * SCENE_TEMPLATES.length)]
}

export function pickTemplateByCategory(category: SceneCategory): SceneTemplate {
  const pool = SCENE_TEMPLATES.filter(t => t.category === category)
  if (pool.length === 0) return pickRandomTemplate()
  return pool[Math.floor(Math.random() * pool.length)]
}
