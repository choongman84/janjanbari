//package com.green.jpa.test.repository;
//
//import com.green.jpa.dto.MemberDTO;
//import com.green.jpa.dto.product.*;
//import com.green.jpa.entity.MemberRole;
//import com.green.jpa.entity.product.Gender;
//import com.green.jpa.entity.product.KitType;
//import com.green.jpa.entity.product.PatchType;
//import com.green.jpa.service.FileService;
//import com.green.jpa.service.MemberService;
//import com.green.jpa.service.product.KitService;
//import com.green.jpa.service.product.OrderService;
//import jakarta.transaction.Transactional;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.mock.web.MockMultipartFile;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.util.ArrayList;
//import java.util.List;
//
//@SpringBootTest
//public class ProductDummyTest {
//
//    @Autowired
//    private OrderService orderService;
//
//    @Autowired
//    private KitService kitService;
//
//    @Autowired
//    private MemberService memberService;  // MemberRepository 대신 Service 사용
//
//    @Autowired
//    private FileService fileService;
//
//    private Long createTestKit() throws IOException {
//        //테스트 이미지 파일 생성
//        Path mainImagePath = Paths.get("src/test/resources/test-images/main.jpg");
//        MultipartFile mainImage = new MockMultipartFile(
//                "mainImage",
//                "main.jpg",
//                "image/jpeg",
//                Files.readAllBytes(mainImagePath)
//        );
//        //서브 이미지 파일(들) 생성
//        List<MultipartFile> subImages = new ArrayList<>();
//        for(int i = 1; i <= 3; i++){
//            Path subImagePath = Paths.get("src/test/resources/test-images/sub" + i + ".jpg");
//            MultipartFile subImage = new MockMultipartFile(
//                    "subImage" + i,
//                    "sub" + i + ".jpg",
//                    "image/jpeg",
//                    Files.readAllBytes(subImagePath)
//            );
//            subImages.add(subImage);
//        }
//        List<String> sizes = new ArrayList<>();
//        sizes.add("S");
//        sizes.add("M");
//        sizes.add("L");
//        sizes.add("XL");
//
//        KitDTO kitDTO = KitDTO.builder()
//                .name("홈 유니폼 23/24")
//                .description(KitType.HOME.getDescription())
//                .price(89000)
//                .season("23/24")
//                .kitType(KitType.HOME)
//                .gender(Gender.MEN)
//                .sizes(sizes)
//                .stock(100)
//                .build();
//
//        System.out.println("\n===== 상품 생성 시작 =====");
//        System.out.println("생성할 상품 정보:");
//        System.out.println("이름: " + kitDTO.getName());
//        System.out.println("설명: " + kitDTO.getDescription());
//        System.out.println("가격: " + kitDTO.getPrice());
//        System.out.println("시즌: " + kitDTO.getSeason());
//        System.out.println("타입: " + kitDTO.getKitType());
//        System.out.println("성별: " + kitDTO.getGender());
//        System.out.println("사이즈: " + kitDTO.getSizes());
//        System.out.println("재고: " + kitDTO.getStock());
//
//        KitDTO savedKit = kitService.createKit(kitDTO,mainImage,subImages);
//
//        System.out.println("\n===== 상품 생성 완료 =====");
//        System.out.println("생성된 상품 ID: " + savedKit.getId());
//        System.out.println("생성 시간: " + savedKit.getCreateDate());
//        System.out.println("수정 시간: " + savedKit.getModifyDate());
//        System.out.println("=======================\n");
//
//        return savedKit.getId();
//    }
//    private void checkTestImagesExist() throws IOException {
//        Path mainImagePath = Paths.get("src/test/resources/test-images/main.jpg");
//        if(!Files.exists(mainImagePath)){
//            throw new IOException("메인 이미지 파일이 없습니다" + mainImagePath);
//        }
//        for(int i = 1; i <= 3; i++){
//            Path subImagePath = Paths.get("src/test/resources/test-images/sub" + i + ".jpg");
//            if(!Files.exists(subImagePath)){
//                throw new IOException("서브 이미지 파일이 없습니다.0" + subImagePath);
//            }
//        }
//    }
//
//    private Long createTestMember() {
//        MemberDTO memberDTO = MemberDTO.builder()
//                .email("test@test.com")
//                .name("이충만")
//                .password("1234")
//                .phone("010-1234-5678")
//                .role(MemberRole.USER)
//                .build();
//
//        System.out.println("\n===== 회원 생성 시작 =====");
//        System.out.println("생성할 회원 정보:");
//        System.out.println("이름: " + memberDTO.getName());
//        System.out.println("이메일: " + memberDTO.getEmail());
//        System.out.println("전화번호: " + memberDTO.getPhone());
//        System.out.println("역할: " + memberDTO.getRole());
//
//        MemberDTO savedMember = memberService.signup(memberDTO);
//
//        System.out.println("\n===== 회원 생성 완료 =====");
//        System.out.println("생성된 회원 ID: " + savedMember.getId());
//        System.out.println("생성 시간: " + savedMember.getCreateDate());
//        System.out.println("수정 시간: " + savedMember.getModifyDate());
//        System.out.println("=======================\n");
//
//        return savedMember.getId();
//    }
//
//    @Test
//    public void createOrderTest() throws IOException {
//        checkTestImagesExist();
//        // given
//        Long kitId = createTestKit();
//        Long memberId = createTestMember();
//
//        List<OrderItemCreateDTO> items = new ArrayList<>();
//        UniformCustomizationDTO customization = UniformCustomizationDTO.builder()
//                .playerName("손흥민")
//                .number("7")
//                .patch(true)
//                .patchType(PatchType.UCL)
//                .build();
//
//        OrderItemCreateDTO item = OrderItemCreateDTO.builder()
//                .kitId(kitId)
//                .selectedSize("L")
//                .quantity(1)
//                .customization(customization)
//                .build();
//
//        items.add(item);
//
//        OrderCreateDTO orderCreateDTO = OrderCreateDTO.builder()
//                .memberId(memberId)
//                .recipientName("이충만")
//                .phone("010-1234-5678")
//                .address("서울시 강남구")
//                .items(items)
//                .build();
//
//        // when
//        OrderDTO createdOrder = orderService.createOrder(orderCreateDTO);
//
//        // then
//        System.out.println("===== 주문 생성 결과 =====");
//        System.out.println("주문 ID: " + createdOrder.getId());
//        System.out.println("주문 상태: " + createdOrder.getStatus());
//        System.out.println("총 금액: " + createdOrder.getTotalAmount() + "원");
//        System.out.println("\n----- 주문 상품 정보 -----");
//        createdOrder.getOrderItems().forEach(orderItem -> {
//            System.out.println("상품 ID: " + orderItem.getKitId());
//            System.out.println("수량: " + orderItem.getQuantity() + "개");
//            System.out.println("사이즈: " + orderItem.getSelectedSize());
//            System.out.println("가격: " + orderItem.getPrice() + "원");
//            if (orderItem.getCustomization() != null) {
//                System.out.println("커스터마이징 정보:");
//                System.out.println("- 선수명: " + orderItem.getCustomization().getPlayerName());
//                System.out.println("- 번호: " + orderItem.getCustomization().getNumber());
//                System.out.println("- 패치: " + orderItem.getCustomization().getPatchType().getDisplayName());
//            }
//            System.out.println("--------------------");
//        });
//    }
//
//    @Test
//    public void productSearchTest() throws IOException {
//        checkTestImagesExist();
//        // given
//        createTestKit(); // 검색할 상품 생성
//
//        KitSearchDTO searchDTO = KitSearchDTO.builder()
//                .kitType(KitType.HOME)
//                .gender(Gender.MEN)
//                .season("23/24")
//                .minPrice(0)
//                .maxPrice(100000)
//                .build();
//
//        // when
//        List<KitDTO> results = kitService.searchKits(searchDTO);
//
//        // then
//        System.out.println("검색된 상품 수: " + results.size());
//        results.forEach(kit -> {
//            System.out.println("상품 ID: " + kit.getId());
//            System.out.println("상품 이름: " + kit.getName());
//            System.out.println("상품 가격: " + kit.getPrice());
//            System.out.println("--------------------");
//        });
//    }
//
//    @Test
//    public void stockManagementTest() throws IOException {
//        checkTestImagesExist();
//        // given
//        Long kitId = createTestKit();
//        int addStock = 50;
//
//        // when
//        kitService.updateStock(kitId, addStock);
//        KitDTO updatedKit = kitService.getKit(kitId);
//
//        // then
//        System.out.println("업데이트된 재고: " + updatedKit.getStock());
//    }
//}
