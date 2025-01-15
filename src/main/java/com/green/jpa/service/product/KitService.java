package com.green.jpa.service.product;

import com.green.jpa.dto.product.*;
import com.green.jpa.entity.product.Gender;
import com.green.jpa.entity.product.Kit;
import com.green.jpa.entity.product.KitType;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public interface KitService {
    // 기본 CRUD
    //KitDTO createKit(KitDTO kitDTO, MultipartFile mainImage, List<MultipartFile> subImages);
    public KitDTO createKitData(KitDTO kitDTO);
    public void saveKitImages(Long kitId, List<MultipartFile> images);
    KitDTO getKit(Long id);
    List<KitDTO> getAllKits();
    KitDTO updateKit(Long id, KitDTO kitDTO);
    void deleteKit(Long id);

    // 검색 관련
    List<KitDTO> getKitsByType(KitType kitType);
    List<KitDTO> getKitsByGender(Gender gender);
    List<KitDTO> getKitsBySeason(String season);
    List<KitDTO> searchKits(KitSearchDTO searchCondition);  // KitSearchCondition을 KitSearchDTO로 변경

    // 재고 관련
    void updateStock(Long kitId, int quantity);
    List<KitDTO> getLowStockKits(int stockLimit);

    // 가격 관련
    List<KitDTO> getKitsByPriceRange(int minPrice, int maxPrice);

    void updatePrice(Long kitId, int newPrice);

    //1125 추가
    CustomizationOptionsDTO getCustomizationOptions(Long kitId);
    PriceCalculationDTO calculateCustomizationPrice(Long kitId, CustomizationRequestDTO request);

    // 기타
    List<KitDTO> getRecentKits(int limit);

    boolean isStockAvailable(Long kitId, int requestedQuantity);
    

    // DTO 변환
    default KitDTO toDto(Kit kit) {
        if (kit == null) return null;

        // 이미지 경로 앞에 서버 URL 경로를 추가
        List<String> imagePaths = Optional.ofNullable(kit.getImages())
                .orElseGet(ArrayList::new) // null일 경우 빈 리스트 반환
                .stream()
                .map(image -> "uploads/" + image) // 이미지 URL 경로 생성
                .toList();

        return KitDTO.builder()
                .id(kit.getId())
                .name(kit.getName())
                .description(kit.getDescription())
                .price(kit.getPrice())
                .season(kit.getSeason())
                .kitType(kit.getKitType())
                .gender(kit.getGender())
                .sizes(kit.getSizes())
                .stock(kit.getStock())
                .createDate(kit.getCreateDate())
                .modifyDate(kit.getModifyDate())
                .images(kit.getImages())
                .build();
    }

    default Kit toEntity(KitDTO dto) {
        if (dto == null) return null;

        return Kit.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .season(dto.getSeason())
                .kitType(dto.getKitType())
                .gender(dto.getGender())
                .sizes(dto.getSizes())
                .stock(dto.getStock())
                .images(dto.getImages()) // 파일 이름 리스트 그대로 사용
                .build();
    }


}