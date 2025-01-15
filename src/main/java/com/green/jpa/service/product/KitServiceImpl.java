package com.green.jpa.service.product;

import com.green.jpa.dto.product.*;
import com.green.jpa.entity.product.Gender;
import com.green.jpa.entity.product.Kit;
import com.green.jpa.entity.product.KitType;
import com.green.jpa.entity.product.PatchType;
import com.green.jpa.exception.OutOfStockException;
import com.green.jpa.exception.ProductNotFoundException;
import com.green.jpa.repository.product.KitRepository;
import com.green.jpa.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class KitServiceImpl implements KitService {

    private final KitRepository kitRepository;
    private final FileService fileService;
    private final PlayerService playerService;

//    @Override
//    @Transactional
//    public KitDTO createKit(KitDTO kitDTO, MultipartFile mainImage, List<MultipartFile> subImages) {
//        validateKitDTO(kitDTO);
//
//        String mainImageUrl = fileService.saveFile(mainImage);
//        List<String> imageUrls = new ArrayList<>();
//        imageUrls.add(mainImageUrl);
//
//        if (subImages != null && !subImages.isEmpty()) {
//            subImages.forEach(img ->
//                imageUrls.add(fileService.saveFile(img)));
//        }
//
//        Kit kit = toEntity(kitDTO);
//        kit.setImages(imageUrls);
//
//        Kit savedKit = kitRepository.save(kit);
//        return toDto(savedKit);
//    }
    @Transactional // or @Transactional(readOnly = false) explicitly
    @Override
    public KitDTO createKitData(KitDTO kitDTO) {
        // KitDTO를 저장하는 로직
        Kit savedKit = kitRepository.save(toEntity(kitDTO));
        return toDto(savedKit);
    }
    @Override
    @Transactional
    public void saveKitImages(Long kitId, List<MultipartFile> images) {
        System.out.println("images: " + images);
        Kit kit = kitRepository.findById(kitId).orElseThrow(() -> new RuntimeException("Kit not found"));
        List<String> imageList = new ArrayList<>();

        for (MultipartFile image : images) {
            String imagePath = fileService.saveFile(image); // 파일 저장 로직
            System.out.println("Saved image path: " + imagePath);
            imageList.add(imagePath); // 리스트에 경로 추가
        }

        // 반복문 종료 후 리스트를 엔티티에 설정
        kit.setImages(imageList);
        kitRepository.save(kit); // 변경 사항 저장
    }


    @Override
    public KitDTO getKit(Long id) {
        return kitRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ProductNotFoundException("상품을 찾을 수 없습니다: " + id));
    }

    @Override
    public List<KitDTO> getAllKits() {
        return kitRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public KitDTO updateKit(Long id, KitDTO kitDTO) {
        Kit kit = kitRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Kit,업데이트 할 상품을 찾을 수 없습니다. ID :" + id));

        kit.setName(kitDTO.getName());
        kit.setDescription(kitDTO.getDescription());
        kit.setPrice(kitDTO.getPrice());
        kit.setSeason(kitDTO.getSeason());
        kit.setKitType(kitDTO.getKitType());
        kit.setGender(kitDTO.getGender());
        kit.setSizes(kitDTO.getSizes());
        kit.setStock(kitDTO.getStock());

        return toDto(kit);
    }

    @Override
    @Transactional
    public void deleteKit(Long id) {
        if(!kitRepository.existsById(id)){
            throw new ProductNotFoundException("Kit,삭제 할 상품을 찾을 수 없습니다 : ID" +id);
        }
        kitRepository.deleteById(id);
    }

    @Override
    public List<KitDTO> getKitsByType(KitType kitType) {
        return kitRepository.findByKitType(kitType).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<KitDTO> getKitsByGender(Gender gender) {
        return kitRepository.findByGender(gender).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<KitDTO> getKitsBySeason(String season) {
        return kitRepository.findBySeason(season).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<KitDTO> searchKits(KitSearchDTO searchDTO) {
        return kitRepository.searchKits(
                searchDTO.getKitType(),
                searchDTO.getGender(),
                searchDTO.getSeason(),
                searchDTO.getMinPrice(),
                searchDTO.getMaxPrice()
            ).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateStock(Long kitId, int quantity) {
        Kit kit = kitRepository.findById(kitId)
                .orElseThrow(() -> new ProductNotFoundException("상품을 찾을 수 없습니다: " + kitId));
                
        int newStock = kit.getStock() + quantity;
        if (newStock < 0) {
            throw new OutOfStockException("재고가 부족합니다. 현재 재고: " + kit.getStock());
        }
        kit.setStock(newStock);
    }

    @Override
    public List<KitDTO> getLowStockKits(int stockLimit) {
        return kitRepository.findLowStockKits(stockLimit).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<KitDTO> getKitsByPriceRange(int minPrice, int maxPrice) {
        if(minPrice < 0 || maxPrice < 0){
            throw new IllegalArgumentException("Kit, 가격은 0보다 작을 수 없습니다.");
        }
        if(minPrice > maxPrice){
            throw new IllegalArgumentException("Kit, 최소 가격이 최대 가격보다 높습니다.");
        }
        return kitRepository.findByPriceRange(minPrice, maxPrice).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updatePrice(Long kitId, int newPrice) {
        if(newPrice < 0){
            throw new IllegalArgumentException("Kit, 가격은 0보다 작을 수 없습니다.");
        }
        Kit kit = kitRepository.findById(kitId)
                .orElseThrow(() -> new ProductNotFoundException("Kit,상품 정보를 불러올 수 없습니다. ID: " + kitId));
        kit.setPrice(newPrice);
    }

    @Override
    public List<KitDTO> getRecentKits(int limit) {
        return kitRepository.findRecentKits(PageRequest.of(0, limit)).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isStockAvailable(Long kitId, int requestedQuantity) {
        Kit kit = kitRepository.findById(kitId)
                .orElseThrow(() -> new ProductNotFoundException("Kit,Kit not found with id: " + kitId));
        return kit.getStock() >= requestedQuantity;
    }

    @Override
    public CustomizationOptionsDTO getCustomizationOptions(Long kitId) {
        Kit kit = kitRepository.findById(kitId)
            .orElseThrow(() -> new ProductNotFoundException("Kit not found: " + kitId));
        
        List<PlayerDTO> players = playerService.getAvailablePlayers();
        
        return CustomizationOptionsDTO.builder()
            .availablePlayers(players)
            .availablePatches(Arrays.asList(PatchType.values()))
            .basePrice(kit.getPrice())
            .nameNumberPrice(28000)
            .patchPrices(Arrays.stream(PatchType.values())
                .collect(Collectors.toMap(
                    patch -> patch,
                    PatchType::getPrice
                )))
            .build();
    }

    @Override
    public PriceCalculationDTO calculateCustomizationPrice(Long kitId, CustomizationRequestDTO request) {
        Kit kit = kitRepository.findById(kitId)
            .orElseThrow(() -> new ProductNotFoundException("Kit not found: " + kitId));
        
        int totalPrice = kit.getPrice();
        
        if (request.isCustomNameNumber()) {
            totalPrice += 28000;
        }
        
        if (request.getPatchType() != null && request.getPatchType() != PatchType.NONE) {
            totalPrice += request.getPatchType().getPrice();
        }
        
        return PriceCalculationDTO.builder()
            .basePrice(kit.getPrice())
            .customizationPrice(totalPrice - kit.getPrice())
            .totalPrice(totalPrice)
            .build();
    }

    private void validateKitDTO(KitDTO dto) {
        if (dto.getStock() < 0) {
            throw new IllegalArgumentException("재고는 0개 이상이어야 합니다.");
        }
        if (dto.getPrice() < 0) {
            throw new IllegalArgumentException("가격은 0원 이상이어야 합니다.");
        }
    }
}