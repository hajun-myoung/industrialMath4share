# Homeworks

과제 제출용 디렉토리입니다

## Directory Names

과제 제출일을 기준으로 파일이 생성됩니다

- 파일명: `{date_of_assign}_hw.js`
  - 서술형 과제: 주석처리하여 포함
  - 코드형 과제: 코드 안에 포함

## Data Structure

User object stored in localStorage:

```json
{
  "email": "user@example.com",
  "password": "hashed_or_plain",
  "createdAt": "ISO_STRING"
}
```

## Flow

1. User signs up -> data stored in localStorage
1. User signs in -> credentials validated
   1. On success -> session stored -> redirect to welcome page
   1. On logout -> session removed
