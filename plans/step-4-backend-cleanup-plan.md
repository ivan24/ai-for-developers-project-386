# План: Очистка бэкенда (API) от неиспользуемых фронтенд-зависимостей

## Цель (Objective)
Удалить рудименты стандартной установки Laravel (Vite, Tailwind CSS, NPM-зависимости, базовые Blade-шаблоны), так как бэкенд используется исключительно как API, а фронтенд работает как отдельное приложение на React. Это уменьшит размер проекта, упростит конфигурацию и ускорит развертывание.

## Ключевые файлы для удаления и изменения (Key Files & Context)

### 1. Удаление конфигурации Node.js и Vite
- `backend/vite.config.js`
- `backend/package.json`
- `backend/package-lock.json` (если присутствует)

### 2. Удаление неиспользуемых ассетов и стилей
- `backend/resources/css/` (полностью со всем содержимым)
- `backend/resources/js/` (полностью со всем содержимым)
- `backend/resources/views/welcome.blade.php`

### 3. Изменение маршрутов (Routes)
- `backend/routes/web.php`

## Шаги реализации (Implementation Steps)

1. **Удалить ненужные файлы в корне бэкенда:**
   - Выполнить удаление файлов конфигурации Node.js (`vite.config.js`, `package.json`, `package-lock.json`).

2. **Удалить папки с ресурсами фронтенда:**
   - Выполнить удаление директорий `backend/resources/css` и `backend/resources/js`, так как компилировать CSS и JS на стороне бэкенда больше не требуется.
   
3. **Очистить Blade-шаблоны:**
   - Удалить файл `backend/resources/views/welcome.blade.php`.

4. **Обновить `web.php`:**
   - Открыть `backend/routes/web.php`.
   - Заменить маршрут `Route::get('/', function () { return view('welcome'); });` на простой JSON-ответ, например:
     ```php
     Route::get('/', function () {
         return response()->json([
             'name' => 'Calendar API',
             'status' => 'ok',
         ]);
     });
     ```
   - Существующий маршрут `/health` можно оставить как есть (или объединить с корневым).

## Проверка (Verification & Testing)
1. Убедиться, что тесты бэкенда (`php artisan test` / `pest`) продолжают успешно проходить.
2. Открыть в браузере корень API (или выполнить curl-запрос) и убедиться, что возвращается корректный JSON, а не ошибка об отсутствии представления `welcome`.
3. Убедиться, что в папке `backend/` не осталось следов Node.js, Vite или Tailwind.
