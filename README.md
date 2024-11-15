# Product catalog

ASP.NET + MS SQL + Angular

## Запуск

1 Отредактировать ConnectionStrings под ваше окружение  
2 Инициализировать и применить миграцию 
```bash
  dotnet ef migrations add InitialCreate
  dotnet ef database update
```
3 При запуске приложения, таблицы заполнятся данными из \Data\SeedData  
4 Тестовые аккаунты там же (логин/пароль): admin/admin, user/user, superuser/superuser  
5 Для Angular возможно выполнить вручную "npm i"  
  
Проект запускается из Visual Studio.  
Для удобства запуска: "Configure Starpup Projects" -> "Multiple Starpup Projects" -> "Action Start везде"
