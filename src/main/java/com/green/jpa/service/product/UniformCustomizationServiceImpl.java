package com.green.jpa.service.product;

import com.green.jpa.dto.product.UniformCustomizationDTO;
import com.green.jpa.entity.product.PatchType;
import com.green.jpa.entity.product.UniformCustomization;
import com.green.jpa.exception.CustomizationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UniformCustomizationServiceImpl implements UniformCustomizationService {

    @Override
    @Transactional
    public UniformCustomizationDTO createCustomization(UniformCustomizationDTO dto) {
        validateCustomization(dto);
        UniformCustomization entity = toEntity(dto);
        return toDto(entity);
    }

    @Override
    public Integer calculatePatchPrice(PatchType patchType) {
        return patchType != null ? patchType.getPrice() : 0;
    }

    @Override
    public Integer calculateNamePrice(String type, String name, String number) {
        boolean hasCustomization = type != null && !type.equals("none");
        boolean hasNameOrNumber = (name != null && !name.isEmpty()) || 
                                (number != null && !number.isEmpty());
        return (hasCustomization && hasNameOrNumber) ? 28000 : 0;
    }

    @Override
    public Integer calculateTotalPrice(UniformCustomizationDTO dto) {
        if (dto == null) return 0;
        return calculatePatchPrice(dto.getPatchType()) + 
               calculateNamePrice(dto.getType(), dto.getCustomName(), dto.getCustomNumber());
    }

    @Override
    public void validateCustomization(UniformCustomizationDTO dto) {
        if (dto == null) {
            throw new CustomizationException("커스터마이징 정보가 없습니다.");
        }
        if (!dto.isPatch() && dto.getPatchType() != null) {
            throw new CustomizationException("패치 옵션이 비활성화되었지만 패치 타입이 선택되었습니다.");
        }
        if (dto.isHasPlayerName() && dto.getType().equals("none")) {
            throw new CustomizationException("이름 옵션이 활성화되었지만 커스터마이징 타입이 none입니다.");
        }
    }

    @Override
    public UniformCustomizationDTO getCustomization(Long itemId) {
        // 구현 추가
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public UniformCustomizationDTO updateCustomization(Long itemId, UniformCustomizationDTO dto) {
        // 구현 추가
        throw new UnsupportedOperationException("Not implemented yet");
    }
}