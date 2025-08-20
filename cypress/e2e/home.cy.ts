describe("Trang chủ", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("Kiểm tra các phần tử header", () => {
    // Test logo
    cy.get('img[alt="demo"]').should("be.visible");

    // Test nút đăng nhập
    cy.get("button").contains("Đăng nhập").should("be.visible");
  });

  it("Kiểm tra phần hero section", () => {
    // Test tiêu đề chính
    cy.get("h2").contains("Về BKT SmartKids").should("be.visible");

    // Test phần giới thiệu
    cy.get("p")
      .contains("SmartKids là phần mềm học trực tuyến")
      .should("be.visible");

    // Test hình ảnh minh họa
    cy.get('img[alt="hero-image"]').should("be.visible");
  });

  it("Kiểm tra phần thống kê", () => {
    // Test các con số thống kê
    cy.get('[data-testid="stats"]').within(() => {
      cy.contains("1000+").should("be.visible");
      cy.contains("Học sinh").should("be.visible");
      cy.contains("50+").should("be.visible");
      cy.contains("Giáo viên").should("be.visible");
    });
  });

  it("Kiểm tra form tư vấn", () => {
    // Test các trường input
    cy.get('input[placeholder="Họ và tên ba mẹ"]').should("be.visible");
    cy.get('input[placeholder="Số điện thoại"]').should("be.visible");
    cy.get('input[placeholder="Email"]').should("be.visible");

    // Test nút submit
    cy.get("button").contains("Nhận tư vấn miễn phí").should("be.visible");

    // Test submit form với dữ liệu hợp lệ
    const testData = {
      name: "Nguyễn Văn A",
      phone: "0987654321",
      email: "test@example.com"
    };

    cy.get('input[placeholder="Họ và tên ba mẹ"]').type(testData.name);
    cy.get('input[placeholder="Số điện thoại"]').type(testData.phone);
    cy.get('input[placeholder="Email"]').type(testData.email);
    cy.get("button").contains("Nhận tư vấn miễn phí").click();

    // Kiểm tra thông báo thành công
    cy.contains("Đăng ký tư vấn thành công").should("be.visible");
  });

  it("Kiểm tra form tư vấn với dữ liệu không hợp lệ", () => {
    // Test với email không hợp lệ
    cy.get('input[placeholder="Email"]').type("invalid-email");
    cy.get("button").contains("Nhận tư vấn miễn phí").click();
    cy.contains("Email không hợp lệ").should("be.visible");

    // Test với số điện thoại không hợp lệ
    cy.get('input[placeholder="Số điện thoại"]').type("123");
    cy.get("button").contains("Nhận tư vấn miễn phí").click();
    cy.contains("Số điện thoại không hợp lệ").should("be.visible");
  });

  it("Kiểm tra phần nền tảng học tập", () => {
    // Test tiêu đề
    cy.get("h2").contains("Nền tảng học tập").should("be.visible");

    // Test các tính năng
    cy.get('[data-testid="platform-features"]').within(() => {
      cy.contains("Học mọi lúc mọi nơi").should("be.visible");
      cy.contains("Giáo trình chuẩn quốc tế").should("be.visible");
      cy.contains("Tương tác trực tiếp").should("be.visible");
    });
  });

  it("Kiểm tra responsive", () => {
    // Test mobile view
    cy.viewport("iphone-x");
    cy.get('[data-testid="mobile-menu"]').should("be.visible");

    // Test tablet view
    cy.viewport("ipad-2");
    cy.get('[data-testid="tablet-layout"]').should("be.visible");

    // Test desktop view
    cy.viewport(1920, 1080);
    cy.get('[data-testid="desktop-layout"]').should("be.visible");
  });
});
