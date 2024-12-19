# 치지직 Pip&Chat 플레이어

## 확장프로그램으로 제작하려던 치지직 서브 플레이어의 Electron 으로 개발 프로젝트

## 기능 :

    0. 치지직 브라우저를 불러와 CSS를 이용하든 요소를 뽑아서 만들든 화면 구성
    1. 치지직 방송화면을 Pip화
    2. Pip화된 화면 밑에 채팅입력이 가능한 영역 구축
    3. Naver 로그인 기능 - 치지직 브라우저가 있으니 이또한 불러와야할듯
    3. 채팅 기능
        * 채팅 기능을 위해선 Naver 로그인이 필수 !!
        * 그런데 이게 이 앱에서 로그인한거로 채팅이 가능한가.....?

## 개발 방향성

    1. 네이버 로그인
        a. 확장프로그램에서 사용했던 방식 << 부적절 >>
            => 이 로그인 방식은 치지직 채팅이 불가능 할 수 있다.
        b. 네이버 API에서 제공하는 로그인 버튼 방식 << √ >>
            => 이 방법으로 하려면 도메인을 지정해주어야한다.
    2. 화면 레이아웃
        a. 메뉴 및 버튼기능
            i) 네이버 로그인
            ii) Pip모드 전환
            iii)

## 참고 API

    ### 팔로우 리스트 가져오기
        https://api.chzzk.naver.com/service/v1/channels/followings?page=0&size=505&type=FOLLOW
        ==> 네이버 로그인이 되어있으면 가져올 수 있음으로 보인다.
        ==> 이곳에서 아래의 내용들을 가져올 수있다.
            1) 팔로우 중인 채널 갯수 + 페이지(pagination 의미인듯?)
            2) 팔로우 중인 채널의 정보
                a. channelId : 채널의 ID
                b. channelImageUrl : 채널의 프로필 이미지
                c. streamer : {
                        openLive : 현재 방송중인지 true / false
                    }
                d. liveInfo : {
                        "liveTitle": 라이브 제목
                        "concurrentUserCount": 시청자 수
                        "liveCategoryValue": 카테고리
                    }
    https://blog.ssogari.dev/25
        * 채널 ID
