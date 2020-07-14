# koreanbots

버그 제보 및 제안을 위한 레포지토리입니다.

## 버그

먼저 지원하는 기기인지 확인합니다.

### 지원하지 않는 기기

```md
- 어떠한 확장프로그램 (AdBlock, Darkmode etc.)
- 브라우저: IE, Pre 17 Edge.
- 공식 지원 종료된 모든 Windows 버전
- 공식 지원 종료된 모든 리눅스 버전
- 3.5" 아이폰
- 5.0 버전 이하의 안드로이드
- 모든 VM
- 10.10 버전 이하의 macOS
- 10.0 버전 이하의 iOS
- 탈옥 또는 루팅된 기기
- 보안 이슈 (보안과 관련된 문제는 비공개적이게 개발자에게 전달해주세요)
- 정식빌드에서는 발생하지 않는 Canary혹은 PTB와 같은 베타 버전의 브라우저/OS에서 발생하는 버그
- 이외 개발자가 지원 종료 선언한 모든 플랫폼혹은 기기
```

그 다음 이슈를 등록합니다.
[등록하기](https://github.com/koreanbots/koreanbots/issues/new/choose)

**이슈에서는 빠른 소통을 위해 약자를 사용합니다.**
이슈를 보신다면 댓글을 남겨주세요.

- `CR` **Can Reproduce** 의 약자로 재현 가능한 버그라는 뜻입니다.
- `CNR` **Can Not Reproduce** 의 약자로 재현이 불가능하다는 뜻입니다.
- `NAB` **Not a Bug** 의 약자로 버그에 해당하지 않는다는 뜻입니다.

### 승인과 거부

버그는 2개의 재현가능 여부에 대한 승인(Approve) 또는 거부(Deny)를 받게되면, 승인과 거부가 결정됩니다.

#### 승인

버그가 재현 가능하다고 2명 이상의 유저에게 승인이 된다면, 해당 버그는 개발자의 확인을 기다리며, `approved` 라벨을 획득합니다.

#### 거부

버그가 재현 가능하지않다고 2명 이상의 유저에게 거부가 된다면, 해당 버그는 `deny` 라벨을 획득하며, 이슈는 `Closed` 처리됩니다.

## 제안

제안은 자유롭게 해주셔도 됩니다!

## 관리

이슈는 관리자와 버그 헌터분들이 관리합니다.

### 버그 헌터란?

버그 헌터는 버그를 열심히 찾아주시거나, 해당 레포지토리에 활발하게 참여하여, 특정 기준 이상을 참여해주신 유저분들에게 지급해드리는 권한입니다.

버그헌터는 이슈를 닫거나, 라벨을 추가할 수 있으며 `Approve`와 `Deny`와 같은 상태를 관리합니다.

### 처벌

이슈에서 장난식 발언을 하거나, 관련성이 없는 말 또는 스팸을 게시한다면, 통보없이 처벌되실 수 있습니다.
