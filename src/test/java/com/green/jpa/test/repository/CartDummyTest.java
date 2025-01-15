//package com.green.jpa.test.repository;
//
//import com.green.jpa.dto.MemberDTO;
//import com.green.jpa.dto.product.CartDTO;
//import com.green.jpa.dto.product.CartItemDTO;
//import com.green.jpa.dto.product.KitDTO;
//import com.green.jpa.dto.product.UniformCustomizationDTO;
//import com.green.jpa.entity.MemberRole;
//import com.green.jpa.entity.product.Gender;
//import com.green.jpa.entity.product.KitType;
//import com.green.jpa.entity.product.PatchType;
//import com.green.jpa.service.FileService;
//import com.green.jpa.service.MemberService;
//import com.green.jpa.service.product.CartService;
//import com.green.jpa.service.product.KitService;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.mock.web.MockMultipartFile;
//import org.springframework.test.annotation.Rollback;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.Arrays;
//import java.util.List;
//
//@SpringBootTest
//@Rollback(value = false)
//public class CartDummyTest {
//   @Autowired
//   private CartService cartService;
//   @Autowired
//   private MemberService memberService;
//   @Autowired
//   private KitService kitService;
//   @Autowired
//   private FileService fileService;
//
//
//   private Long createTestKit() throws IOException {
//       //테스트 이미지 파일 생성
//       Path mainImagePath = Paths.get("src/test/resources/test-images/main.jpg");
//       MultipartFile mainImage = new MockMultipartFile(
//               "mainImage",
//               "main.jpg",
//               "image/jpg",
//               Files.readAllBytes(mainImagePath)
//       ) {
//       };
//       //서브 이미지 파일(들) 생성
//       List<MultipartFile> subImages = new ArrayList<>();
//       for(int i = 1; i <= 3; i++){
//           Path subImagePath = Paths.get("src/test/resources/test-images/sub" + i + ".jpg");
//           MultipartFile subImage = new MockMultipartFile(
//                   "subImage" + i,
//                   "sub" + i + ".jpg",
//                   "image/jpg",
//                   Files.readAllBytes(subImagePath)
//           );
//           subImages.add(subImage);
//       }
//       List<String> sizes = new ArrayList<>();
//       sizes.add("S");
//       sizes.add("M");
//       sizes.add("L");
//       sizes.add("XL");
//
//       KitDTO kitDTO = KitDTO.builder()
//               .name("홈 유니폼 23/24")
//               .description(KitType.HOME.getDescription())
//               .price(89000)
//               .season("23/24")
//               .kitType(KitType.HOME)
//               .gender(Gender.MEN)
////               .sizes(sizes)
//               .stock(100)
//               .build();
//
//       System.out.println("\n===== 상품 생성 시작 =====");
//       System.out.println("생성할 상품 정보:");
//       System.out.println("이름: " + kitDTO.getName());
//       System.out.println("설명: " + kitDTO.getDescription());
//       System.out.println("가격: " + kitDTO.getPrice());
//       System.out.println("시즌: " + kitDTO.getSeason());
//       System.out.println("타입: " + kitDTO.getKitType());
//       System.out.println("성별: " + kitDTO.getGender());
//       System.out.println("사이즈: " + kitDTO.getSizes());
//       System.out.println("재고: " + kitDTO.getStock());
//
//       KitDTO savedKit = kitService.createKit(kitDTO,mainImage,subImages);
//
//       System.out.println("\n===== 상품 생성 완료 =====");
//       System.out.println("생성된 상품 ID: " + savedKit.getId());
//       System.out.println("생성 시간: " + savedKit.getCreateDate());
//       System.out.println("수정 시간: " + savedKit.getModifyDate());
//       System.out.println("=======================\n");
//
//       return savedKit.getId();
//   }
//
//   private Long loginTestMember() {
//       MemberDTO memberDTO = MemberDTO.builder()
//               .email("test@example.com")
//               .password("password123")
//               .build();
//
//       System.out.println("\n===== 회원 로그인 시작 =====");
//       System.out.println("로그인 정보:");
//       System.out.println("이메일: " + memberDTO.getEmail());
//
//       MemberDTO loginMember = memberService.login("test@example.com","password123");
//
//       System.out.println("\n===== 회원 로그인 완료 =====");
//       System.out.println("로그인된 회원 ID: " + loginMember.getId());
//       System.out.println("로그인 시간: " + LocalDateTime.now());
//       System.out.println("=======================\n");
//
//       return loginMember.getId();
//   }
//
//   @Test
//   public void cartTest() throws IOException {
//       // given
//       Long kitId = createTestKit();
//       Long memberId = loginTestMember();
//
//       // 장바구니에 담을 상품 DTO 생성
//       CartItemDTO dto = CartItemDTO.builder()
//               .kitId(kitId)
//               .quantity(2)
//               .size("S")  // 사이즈 리스트로 변경
//               .customization(UniformCustomizationDTO.builder()
//                       .namePrice(10000)
//                       .patchPrice(5000)
//                       .patchType(PatchType.CWCUP)
//                       .build())
//               .build();
//
//       // when - 장바구니 추가
//       CartItemDTO addedItem = cartService.addCartItem(memberId, dto);
//
//       // then - 결과 출력
//       System.out.println("\n===========장바구니 추가 결과 ================");
//       System.out.println("상품 ID : " + addedItem.getKitId());
//       System.out.println("상품명 : " + addedItem.getKitName());
//       System.out.println("수량 : " + addedItem.getQuantity());
//       System.out.println("사이즈 : " + addedItem.getSize());
////       System.out.println("가격 : " + addedItem.getPrice());
//       System.out.println("총가격 : " + addedItem.getTotalPrice());
//
//       //when - 이걸 실행해 - 수량변경
//       CartItemDTO updateItem = cartService.updateCartItemQuantity(memberId,kitId, 5);
//
//       // then - 결과를 알려줘
//       System.out.println("\n====== 수량 변경 결과 =========");
//       System.out.println("변경된 수량 : " + updateItem.getQuantity());
//       System.out.println("변경된 총가격 : " + updateItem.getTotalPrice());
//
//       //when - 이걸 실행해 - 장바구니 조회
//       CartDTO cart = cartService.getCart(memberId);
//
//       //then - 결과를 알려줘
//       System.out.println("\n=========장바구니 조회 결과 ==================");
//       System.out.println("총 상품 수 :" + cart.getCartItems());
//       System.out.println("총 금액 : " + cart.getTotalAmount());
//
//       //when - 이걸실행해 - 장바구니 비우기
//       cartService.clearCart(memberId);
//       CartDTO emptyCart = cartService.getCart(memberId);
//
//       //then - 결과를 알려줘
//       System.out.println("\n ===========장바구니 조회 결과=========");
//       System.out.println("남은 상품 수 : " + emptyCart.getCartItems());
//       System.out.println("\n=================================");
//   }
//
//}
