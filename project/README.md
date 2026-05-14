# Usage

> Notice: Database Typing이 변경되었습니다
> 아래 내용을 따라가주세요

## Init DB

```sh
npm run db:init
# or
yarn db:init
```

## Error Handling

만약, 데이터베이스 관련 오류가 뜨는 경우:

```sh
# 기존 DB 삭제(필요시 데이터 미리 백업할 것)
# Project 디렉토리에서
rm src/data/main.db

# 새로 셋팅, 실행 중인 서버가 있다면 중지 권장
npm run db:init
# or
yarn db:init
```
