<template>
  <aside class="w-60 bg-white border-r">
    <nav class="p-4">
      <ul class="space-y-2">
        <li><router-link to="/" class="block p-2 rounded hover:bg-gray-200">Главная</router-link></li>
        <li><router-link to="/students" class="block p-2 rounded hover:bg-gray-200">Студенты</router-link></li>
        <li><router-link to="/flows" class="block p-2 rounded hover:bg-gray-200">Потоки</router-link></li>
        <li><router-link to="/finance" class="block p-2 rounded hover:bg-gray-200">Финансы</router-link></li>
      </ul>
    </nav>
  </aside>
</template>