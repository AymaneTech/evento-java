package com.aymanetech.event.event.infrastructure.web;

import com.aymanetech.event.event.application.dto.request.CategoryRequestDto;
import com.aymanetech.event.event.application.dto.response.CategoryResponseDto;
import com.aymanetech.event.event.application.service.CategoryService;
import com.aymanetech.event.event.domain.vo.CategoryId;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

import static com.aymanetech.event.common.util.UriUtil.getUri;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {
    public static final String BASE_URL = "/api/v1/categories";
    private final CategoryService categoryService;

    @GetMapping
    ResponseEntity<List<CategoryResponseDto>> findAllCategories() {
        var categories = categoryService.findAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    ResponseEntity<CategoryResponseDto> findCategoryById(@PathVariable Long id) {
        var category = categoryService.findCategoryById(CategoryId.of(id));
        return ResponseEntity.ok(category);
    }

    @PostMapping
    public ResponseEntity<CategoryResponseDto> createCategory(@RequestBody @Valid CategoryRequestDto request) {
        var category = categoryService.createCategory(request);
        return ResponseEntity.created(getUri(BASE_URL, category.id()))
                .body(category);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponseDto> updateCategory(@PathVariable Long id, @RequestBody @Valid CategoryRequestDto request) {
        var category = categoryService.updateCategory(CategoryId.of(id), request);
        return ResponseEntity.ok(category);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(CategoryId.of(id));
        return ResponseEntity.noContent().build();
    }
}