# Goals Manager API (Node.js)
> é uma API RESTful desenvolvida para ajudar os usuários a gerenciar suas metas pessoais e profissionais. Com esta API, os usuários podem criar e visualizar metas, bem como acompanhar o progresso de suas metas ao longo da semana corrente.

## Instalação:
Clone o repositorio:<br/>
```
git clone https://github.com/Douglascrc/manage_goals

```
Navegue para o diretório do projeto:<br/>
```   
cd ./manage_goals
````
Instale as dependências necessárias:<br/>
```
npm i
```
## Como usar:
#### endpoints
`POST /goals` - Esse endpoint permite que você crie metas e defina a quantidade de vezes que deve realiza-la durante a semana:
```
{
    "title":"Caminhar",
    "weeklyFrequency": 5 
}
```
------
`Post /completions` - Permite que você marque a meta concluída passando o ID da meta:
```
{
    "goalId":"dnc441s7gx9kir9uifkt1et7",  
}
```
---
`GET /pending-goals` - Retorna as metas pendentes na semana e a quantidade de vezes que foram completadas
```
{
    "pendingGoals": [
        {
            "id": "imi7wcphuqp1fu8i2y7muk9",
            "title": "Caminhar",
            "weeklyFrequence": 5,
            "completionsCount": 1
        },
        {
            "id": "sobalmuk41b7sli8opwo5ge",
            "title": "Acordar 8h",
            "weeklyFrequence": 5,
            "completionsCount": 0
        },
```
___
`GET /summary` - Retorna o resumo das metas concluidas na semana e das metas que não foram e o total
```
{
    "summary": [
        {
            "completed": 1,
            "total": 19,
            "goalsPerDay": {
                "2024-09-29": [
                    {
                        "id": "dnc441s7gx9kir9uifkt1et7",
                        "title": "Estudar JavaScript",
                        "completedAt": "2024-09-29T03:00:00"
                    }
                ]
            }
        }
    ]
}
```
