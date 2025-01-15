package com.green.jpa.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.green.jpa.dto.product.*;
import com.green.jpa.entity.product.Gender;
import com.green.jpa.entity.product.KitType;
import com.green.jpa.service.product.KitService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.authentication.configuration.EnableGlobalAuthentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/admin/kits")
@RequiredArgsConstructor
@EnableGlobalAuthentication
public class AdminKitController {

    private final KitService kitService;

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping(value = "/kit-data", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<KitDTO> createKitData(@RequestBody KitDTO kitDTO) {
        log.info("Received KitDTO: {}", kitDTO);
        KitDTO savedKit = kitService.createKitData(kitDTO); // 서비스 메서드 호출
        return ResponseEntity.ok(savedKit);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping(value = "/kit-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> uploadKitImages(@RequestParam("kitId") Long kitId,
                                                @RequestPart("images") List<MultipartFile> images) {
        log.info("Received {} images for Kit ID: {}", images.size(), kitId);
        kitService.saveKitImages(kitId, images); // 서비스 메서드 호출
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<KitDTO> getKit(@PathVariable Long id) {
        return ResponseEntity.ok(kitService.getKit(id));
    }

    @GetMapping
    public ResponseEntity<List<KitDTO>> getAllKits() {
        return ResponseEntity.ok(kitService.getAllKits());
    }

    @PutMapping("/{id}")
    public ResponseEntity<KitDTO> updateKit(
            @PathVariable Long id,
            @Validated @RequestBody KitDTO kitDTO) {
        return ResponseEntity.ok(kitService.updateKit(id, kitDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteKit(@PathVariable Long id) {
        kitService.deleteKit(id);
        return ResponseEntity.ok().build();
    }

    // 검색 관련
    @GetMapping("/search")
    public ResponseEntity<List<KitDTO>> searchKits(@ModelAttribute KitSearchDTO searchDTO) {
        return ResponseEntity.ok(kitService.searchKits(searchDTO));
    }

    @GetMapping("/type/{kitType}")
    public ResponseEntity<List<KitDTO>> getKitsByType(@PathVariable KitType kitType) {
        return ResponseEntity.ok(kitService.getKitsByType(kitType));
    }

    @GetMapping("/gender/{gender}")
    public ResponseEntity<List<KitDTO>> getKitsByGender(@PathVariable Gender gender) {
        return ResponseEntity.ok(kitService.getKitsByGender(gender));
    }

    @GetMapping("/season/{season}")
    public ResponseEntity<List<KitDTO>> getKitsBySeason(@PathVariable String season) {
        return ResponseEntity.ok(kitService.getKitsBySeason(season));
    }

    // 재고 관련
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/stock")
    public ResponseEntity<Void> updateStock(
            @PathVariable Long id,
            @RequestParam int quantity) {
        kitService.updateStock(id, quantity);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stock/low")
    public ResponseEntity<List<KitDTO>> getLowStockKits(
            @RequestParam(defaultValue = "10") int stockLimit) {
        return ResponseEntity.ok(kitService.getLowStockKits(stockLimit));
    }

    // 가격 관련
    @GetMapping("/price-range")
    public ResponseEntity<List<KitDTO>> getKitsByPriceRange(
            @RequestParam int minPrice,
            @RequestParam int maxPrice) {
        return ResponseEntity.ok(kitService.getKitsByPriceRange(minPrice, maxPrice));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/price")
    public ResponseEntity<Void> updatePrice(
            @PathVariable Long id,
            @RequestParam int newPrice) {
        kitService.updatePrice(id, newPrice);
        return ResponseEntity.ok().build();
    }

    // 기타
    @GetMapping("/recent")
    public ResponseEntity<List<KitDTO>> getRecentKits(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(kitService.getRecentKits(limit));
    }

    @GetMapping("/{id}/stock-check")
    public ResponseEntity<Boolean> checkStockAvailability(
            @PathVariable Long id,
            @RequestParam int quantity) {
        return ResponseEntity.ok(kitService.isStockAvailable(id, quantity));
    }
    @GetMapping("/detail/{id}")
    public ResponseEntity<KitDTO> getKitDetail(@PathVariable Long id) {
        try {
            KitDTO kitDetail = kitService.getKit(id);
            System.out.println("키트에서 이미지 요청   Image URL: {}" + kitDetail.getImages()); // 실제 이미지 경로 확인
            return ResponseEntity.ok(kitDetail);
        } catch (Exception e) {
            log.error("Kit detail fetch failed for id: {}", id, e);
            return ResponseEntity.notFound().build();
        }
    }

    // 1125 추가 맵핑 앤드포인트 메서드
    @GetMapping("/{id}/customization-options")
    public ResponseEntity<CustomizationOptionsDTO> getCustomizationOptions(@PathVariable Long id) {
        try {
            CustomizationOptionsDTO options = kitService.getCustomizationOptions(id);
            return ResponseEntity.ok(options);
        } catch (Exception e) {
            log.error("Customization options fetch failed for kit id: {}", id, e);
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/calculate-price")
    public ResponseEntity<PriceCalculationDTO> calculateCustomizationPrice(
        @PathVariable Long id,
        @RequestBody CustomizationRequestDTO request
    ) {
        try {
            PriceCalculationDTO price = kitService.calculateCustomizationPrice(id, request);
            return ResponseEntity.ok(price);
        } catch (Exception e) {
            log.error("Price calculation failed for kit id: {}", id, e);
            return ResponseEntity.badRequest().build();
        }
    }
}