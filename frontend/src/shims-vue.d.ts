// src/shims-vue.d.ts
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
// src/shims.d.ts
declare module '*.svg' {
  const src: string
  export default src
}
