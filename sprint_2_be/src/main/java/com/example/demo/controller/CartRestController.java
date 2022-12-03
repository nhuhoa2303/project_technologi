package com.example.demo.controller;

import com.example.demo.dto.ErrorDTO;
import com.example.demo.dto.ICartDto;
import com.example.demo.dto.PaymentDto;
import com.example.demo.model.Cart;
import com.example.demo.model.Customer;
import com.example.demo.model.Product;
import com.example.demo.repository.ICartRepository;
import com.example.demo.repository.IProductRepository;
import com.example.demo.service.product.ICartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Optional;

import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;

@RestController
@CrossOrigin
public class CartRestController {
    @Autowired
    private IProductRepository iProductRepository;

    @Autowired
    private ICartRepository iCartRepository;
    @Autowired
    private ICartService iCartService;

    @Autowired
    public JavaMailSender emailSender;

    @Value("${FE_URL}")
    private String apiUrl;

    //    //hiển thị danh sách sản phẩm trong giỏ hàng
    @PostMapping("/cart")
    public ResponseEntity<?> displayProductInCart(@RequestBody Customer customer) {
        List<Cart> carts = this.iCartRepository.displayProductInCart(customer);
        if (carts.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(carts, OK);
    }

    @GetMapping("/cart/find-by-id/{id}")
    public ResponseEntity<Optional<Product>> getProductById(@PathVariable Integer id) {
        Optional<Product> product = this.iProductRepository.findById(id);
        if (product == null) {
            return new ResponseEntity<>(NOT_FOUND);
        }
        return new ResponseEntity<>(product, OK);
    }

    @PostMapping("/cart/delete")
    public ResponseEntity<?> deleteProductInCart(@RequestBody Cart productOrder) {
        Boolean check = this.iCartService.findProductOrder(productOrder);
        if (check) {
            List<Cart> productOrderList = this.iCartService.displayProductInCart(productOrder.getCustomer());
            return new ResponseEntity<>(productOrderList, OK);
        }
        ErrorDTO errorDto = new ErrorDTO();
        errorDto.setMessage("notfound");
        return new ResponseEntity<>(errorDto, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping("/add/cart")
    public ResponseEntity<?> addToCard(@RequestBody Cart cart) {
        ErrorDTO err = this.iCartService.saveCart(cart);

        if (err.getMessage() != null) {
            return new ResponseEntity<>(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(cart, OK);
    }




    @PostMapping("/quantity")
    public ResponseEntity<?> displayQuantityProductInCart(@RequestBody Customer customer) {
        List<Cart> numberQuantity = this.iCartService.displayProductInCart(customer);
        if (numberQuantity == null) {
            return new ResponseEntity<>(NOT_FOUND);
        }
        return new ResponseEntity<>(numberQuantity, OK);
    }

    @PostMapping("/minus/quantity")
    public ResponseEntity<?> minusQuantityCart(@RequestBody Cart productOrder) {
        List<Cart> cartList = this.iCartService.displayProductInCart(productOrder.getCustomer());
        Boolean check = this.iCartService.minusQuantity(productOrder);
        if (check) {
            return new ResponseEntity<>(cartList, OK);
        }
        ErrorDTO errorDto = new ErrorDTO();
        errorDto.setMessage("minimum");
        return new ResponseEntity<>(errorDto, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping("/plus/quantity")
    public ResponseEntity<?> plusQuantityCart(@RequestBody Cart productOrder) {
        List<Cart> cartList = this.iCartService.displayProductInCart(productOrder.getCustomer());
        Boolean check = this.iCartService.plusQuantity(productOrder);
        if (check) {
            return new ResponseEntity<>(cartList, OK);
        }
        ErrorDTO errorDto = new ErrorDTO();
        errorDto.setMessage("minimum");
        return new ResponseEntity<>(errorDto, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping("/cart/payment")
    public ResponseEntity<?> goPayment(@RequestBody Customer customer) throws MessagingException {
        PaymentDto paymentDto = this.iCartService.goPayment(customer);
        MimeMessage message = emailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        String htmlMsg = createHTMLMailForm(paymentDto);
        message.setContent(htmlMsg, "text/html; charset=UTF-8");

        helper.setTo(paymentDto.getCustomer().getEmail());

        helper.setSubject("[Shoppe-Fake SHOP] Hóa đơn thanh toán");

        this.emailSender.send(message);

        return new ResponseEntity<>(paymentDto, OK);
    }
    private String createHTMLMailForm(PaymentDto paymentDto) {
        String template = "<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "<head>\n" +
                "    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"/>\n" +
                "    <title> Order confirmation </title>\n" +
                "    <meta name=\"robots\" content=\"noindex,nofollow\"/>\n" +
                "    <meta name=\"viewport\" content=\"width=device-width; initial-scale=1.0;\"/>\n" +
                "    <style type=\"text/css\">\n" +
                "        @import url(https://fonts.googleapis.com/css?family=Open+Sans:400,700);\n" +
                "\n" +
                "        body {\n" +
                "            margin: 0;\n" +
                "            padding: 0;\n" +
                "            background: #e1e1e1;\n" +
                "        }\n" +
                "\n" +
                "        div, p, a, li, td {\n" +
                "            -webkit-text-size-adjust: none;\n" +
                "        }\n" +
                "\n" +
                "        .ReadMsgBody {\n" +
                "            width: 100%;\n" +
                "            background-color: #ffffff;\n" +
                "        }\n" +
                "\n" +
                "        .ExternalClass {\n" +
                "            width: 100%;\n" +
                "            background-color: #ffffff;\n" +
                "        }\n" +
                "\n" +
                "        body {\n" +
                "            width: 100%;\n" +
                "            height: 100%;\n" +
                "            background-color: #e1e1e1;\n" +
                "            margin: 0;\n" +
                "            padding: 0;\n" +
                "            -webkit-font-smoothing: antialiased;\n" +
                "        }\n" +
                "\n" +
                "        html {\n" +
                "            width: 100%;\n" +
                "        }\n" +
                "\n" +
                "        p {\n" +
                "            padding: 0 !important;\n" +
                "            margin-top: 0 !important;\n" +
                "            margin-right: 0 !important;\n" +
                "            margin-bottom: 0 !important;\n" +
                "            margin-left: 0 !important;\n" +
                "        }\n" +
                "\n" +
                "        .visibleMobile {\n" +
                "            display: none;\n" +
                "        }\n" +
                "\n" +
                "        .hiddenMobile {\n" +
                "            display: block;\n" +
                "        }\n" +
                "\n" +
                "        @media only screen and (max-width: 600px) {\n" +
                "            body {\n" +
                "                width: auto !important;\n" +
                "            }\n" +
                "\n" +
                "            table[class=fullTable] {\n" +
                "                width: 96% !important;\n" +
                "                clear: both;\n" +
                "            }\n" +
                "\n" +
                "            table[class=fullPadding] {\n" +
                "                width: 85% !important;\n" +
                "                clear: both;\n" +
                "            }\n" +
                "\n" +
                "            table[class=col] {\n" +
                "                width: 45% !important;\n" +
                "            }\n" +
                "\n" +
                "            .erase {\n" +
                "                display: none;\n" +
                "            }\n" +
                "        }\n" +
                "\n" +
                "        @media only screen and (max-width: 420px) {\n" +
                "            table[class=fullTable] {\n" +
                "                width: 100% !important;\n" +
                "                clear: both;\n" +
                "            }\n" +
                "\n" +
                "            table[class=fullPadding] {\n" +
                "                width: 85% !important;\n" +
                "                clear: both;\n" +
                "            }\n" +
                "\n" +
                "            table[class=col] {\n" +
                "                width: 100% !important;\n" +
                "                clear: both;\n" +
                "            }\n" +
                "\n" +
                "            table[class=col] td {\n" +
                "                text-align: left !important;\n" +
                "            }\n" +
                "\n" +
                "            .erase {\n" +
                "                display: none;\n" +
                "                font-size: 0;\n" +
                "                max-height: 0;\n" +
                "                line-height: 0;\n" +
                "                padding: 0;\n" +
                "            }\n" +
                "\n" +
                "            .visibleMobile {\n" +
                "                display: block !important;\n" +
                "            }\n" +
                "\n" +
                "            .hiddenMobile {\n" +
                "                display: none !important;\n" +
                "            }\n" +
                "        }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "<!-- Header -->\n" +
                "<table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\" class=\"fullTable\" bgcolor=\"#e1e1e1\">\n" +
                "    <tr>\n" +
                "        <td height=\"20\"></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "        <td>\n" +
                "            <table width=\"600\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\" class=\"fullTable\"\n" +
                "                   bgcolor=\"#ffffff\" style=\"border-radius: 10px 10px 0 0;\">\n" +
                "                <tr class=\"hiddenMobile\">\n" +
                "                    <td height=\"40\"></td>\n" +
                "                </tr>\n" +
                "                <tr class=\"visibleMobile\">\n" +
                "                    <td height=\"30\"></td>\n" +
                "                </tr>\n" +
                "\n" +
                "                <tr>\n" +
                "                    <td>\n" +
                "                        <table width=\"480\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\"\n" +
                "                               class=\"fullPadding\">\n" +
                "                            <tbody>\n" +
                "                            <tr>\n" +
                "                                <td>\n" +
                "                                    <table width=\"220\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"left\"\n" +
                "                                           class=\"col\">\n" +
                "                                        <tbody>\n" +
                "                                        <tr>\n" +
                "                                            <td align=\"left\"><span style=\"font-size: 26px\"><strong\n" +
                "                                                    style=\"text-transform: uppercase; color: #D19C97\">Shoppe-Fake</strong></span>\n" +
                "                                            </td>\n" +
                "                                        </tr>\n" +
                "                                        <tr class=\"hiddenMobile\">\n" +
                "                                            <td height=\"40\"></td>\n" +
                "                                        </tr>\n" +
                "                                        <tr class=\"visibleMobile\">\n" +
                "                                            <td height=\"20\"></td>\n" +
                "                                        </tr>\n" +
                "                                        <tr>\n" +
                "                                            <td style=\"font-size: 12px; color: #5b5b5b; font-family: 'Open Sans', sans-serif; line-height: 18px; vertical-align: top; text-align: left;\">\n" +
                "                                                Chào, <strong>" + paymentDto.getCustomer().getName() + "</strong>.\n" +
                "                                                <br> Cảm ơn bạn đã mua sắm từ cửa hàng của chúng tôi.\n" +
                "                                            </td>\n" +
                "                                        </tr>\n" +
                "                                        </tbody>\n" +
                "                                    </table>\n" +
                "                                    <table width=\"220\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"right\"\n" +
                "                                           class=\"col\">\n" +
                "                                        <tbody>\n" +
                "                                        <tr class=\"visibleMobile\">\n" +
                "                                            <td height=\"20\"></td>\n" +
                "                                        </tr>\n" +
                "                                        <tr>\n" +
                "                                            <td height=\"5\"></td>\n" +
                "                                        </tr>\n" +
                "                                        <tr>\n" +
                "                                            <td style=\"font-size: 21px; color: #ff0000; letter-spacing: -1px; font-family: 'Open Sans', sans-serif; line-height: 1; vertical-align: top; text-align: right;\">\n" +
                "                                                Hóa đơn thanh toán\n" +
                "                                            </td>\n" +
                "                                        </tr>\n" +
                "                                        <tr>\n" +
                "                                        <tr class=\"hiddenMobile\">\n" +
                "                                            <td height=\"50\"></td>\n" +
                "                                        </tr>\n" +
                "                                        <tr class=\"visibleMobile\">\n" +
                "                                            <td height=\"20\"></td>\n" +
                "                                        </tr>\n" +
                "                                        <tr>\n" +
                "                                            <td style=\"font-size: 12px; color: #5b5b5b; font-family: 'Open Sans', sans-serif; line-height: 18px; vertical-align: top; text-align: right;\">\n" +
//                "                                                <small>Hóa đơn: </small> #" + paymentDto + "<br/>\n" +
                "                                                <small>Ngày tạo: </small>" + new SimpleDateFormat("dd/MM/yyyy").format(paymentDto.getBill().getCreationDate()) + "\n" +
                "                                            </td>\n" +
                "                                        </tr>\n" +
                "                                        </tbody>\n" +
                "                                    </table>\n" +
                "                                </td>\n" +
                "                            </tr>\n" +
                "                            </tbody>\n" +
                "                        </table>\n" +
                "                    </td>\n" +
                "                </tr>\n" +
                "            </table>\n" +
                "        </td>\n" +
                "    </tr>\n" +
                "</table>\n" +
                "<!-- /Header -->\n" +
                "<!-- Order Details -->\n" +
                "<table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\" class=\"fullTable\" bgcolor=\"#e1e1e1\">\n" +
                "    <tbody>\n" +
                "    <tr>\n" +
                "        <td>\n" +
                "            <table width=\"600\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\" class=\"fullTable\"\n" +
                "                   bgcolor=\"#ffffff\">\n" +
                "                <tbody>\n" +
                "                <tr>\n" +
                "                <tr class=\"hiddenMobile\">\n" +
                "                    <td height=\"60\"></td>\n" +
                "                </tr>\n" +
                "                <tr class=\"visibleMobile\">\n" +
                "                    <td height=\"40\"></td>\n" +
                "                </tr>\n" +
                "                <tr>\n" +
                "                    <td>\n" +
                "                        <table width=\"480\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\"\n" +
                "                               class=\"fullPadding\">\n" +
                "                            <tbody>\n" +
                "                            <tr>\n" +
                "                                <th style=\"font-size: 12px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; font-weight: normal; line-height: 1; vertical-align: top; padding: 0 10px 7px 0;\"\n" +
                "                                    width=\"52%\" align=\"left\">\n" +
                "                                    <b>Sản phẩm</b>\n" +
                "                                </th>\n" +
                "                                <th style=\"font-size: 12px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; font-weight: normal; line-height: 1; vertical-align: top; padding: 0 10px 7px 0;\"\n" +
                "                                    align=\"center\">\n" +
                "                                    <b>Số lượng</b>\n" +
                "                                </th>\n" +
                "                                <th style=\"font-size: 12px; font-family: 'Open Sans', sans-serif; color: #1e2b33; font-weight: normal; line-height: 1; vertical-align: top; padding: 0 10px 7px 0;\"\n" +
                "                                    align=\"right\">\n" +
                "                                    <b>Đơn giá</b>\n" +
                "                                </th>\n" +
                "                            </tr>\n" +
                "                            <tr>\n" +
                "                                <td height=\"1\" style=\"background: #bebebe;\" colspan=\"4\"></td>\n" +
                "                            </tr>\n" +
                "                            <tr>\n" +
                "                                <td height=\"10\" colspan=\"4\"></td>\n" +
                "                            </tr>\n";
        Double totalMoney = 0d;
        Double shipMoney = 35000d;
        for (int i = 0; i < paymentDto.getCartList().size(); i++) {
            Double productPrice = paymentDto.getCartList().get(i).getProduct().getPriceSale();
            Integer discountProduct = paymentDto.getCartList().get(i).getQuantity();
            Double priceDiscountProduct = (productPrice * discountProduct);
            totalMoney = priceDiscountProduct;
            template += "                            <tr>\n" +
                    "                                <td style=\"font-size: 12px; font-family: 'Open Sans', sans-serif; color: #ff0000;  line-height: 18px;  vertical-align: top; padding:10px 0;\"\n" +
                    "                                    class=\"article\">\n" +
                    "                                    " + paymentDto.getCartList().get(i).getProduct().getName() + "\n" +
                    "                                </td>\n" +
                    "                                <td style=\"font-size: 12px; font-family: 'Open Sans', sans-serif; color: #646a6e;  line-height: 18px;  vertical-align: top; padding:10px 0;\"\n" +
                    "                                    align=\"center\">" + paymentDto.getCartList().get(i).getQuantity() + "\n" +
                    "                                </td>\n" +
                    "                                <td style=\"font-size: 12px; font-family: 'Open Sans', sans-serif; color: #1e2b33;  line-height: 18px;  vertical-align: top; padding:10px 0;\"\n" +
                    "                                    align=\"right\">" + new DecimalFormat("###,###,###.##").format(productPrice) + "<sup>đ</sup>\n" +
                    "                                </td>\n" +
                    "                            </tr>\n";
        }
        template += "                            <tr>\n" +
                "                                <td height=\"1\" colspan=\"4\" style=\"border-bottom:1px solid #e4e4e4\"></td>\n" +
                "                            </tr>\n" +
                "                            </tbody>\n" +
                "                        </table>\n" +
                "                    </td>\n" +
                "                </tr>\n" +
                "                <tr>\n" +
                "                    <td height=\"20\"></td>\n" +
                "                </tr>\n" +
                "                </tbody>\n" +
                "            </table>\n" +
                "        </td>\n" +
                "    </tr>\n" +
                "    </tbody>\n" +
                "</table>\n" +
                "<!-- /Order Details -->\n" +
                "<!-- Total -->\n" +
                "<table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\" class=\"fullTable\" bgcolor=\"#e1e1e1\">\n" +
                "    <tbody>\n" +
                "    <tr>\n" +
                "        <td>\n" +
                "            <table width=\"600\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\" class=\"fullTable\"\n" +
                "                   bgcolor=\"#ffffff\">\n" +
                "                <tbody>\n" +
                "                <tr>\n" +
                "                    <td>\n" +
                "                        <!-- Table Total -->\n" +
                "                        <table width=\"480\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\"\n" +
                "                               class=\"fullPadding\">\n" +
                "                            <tbody>\n" +
                "                            <tr>\n" +
                "                                <td style=\"font-size: 12px; font-family: 'Open Sans', sans-serif; color: #646a6e; line-height: 28px; vertical-align: top; text-align:right; \">\n" +
                "                                    Tổng tiền:\n" +
                "                                </td>\n" +
                "                                <td style=\"font-size: 12px; font-family: 'Open Sans', sans-serif; color: #646a6e; line-height: 22px; vertical-align: top; text-align:right;\"width=\"160\">\n" +
                "                                    " + new DecimalFormat("###,###,###.##").format(totalMoney) + "<sup>đ</sup>\n" +
                "                                </td>\n" +
                "                            </tr>\n" +
                "                            <tr>\n" +
                "                                <td style=\"font-size: 12px; font-family: 'Open Sans', sans-serif; color: #646a6e; line-height: 28px; vertical-align: top; text-align:right; \">\n" +
                "                                    Phí vận chuyển:\n" +
                "                                </td>\n" +
                "                                <td style=\"font-size: 12px; font-family: 'Open Sans', sans-serif; color: #646a6e; line-height: 22px; vertical-align: top; text-align:right; \">\n" +
                "                                    " + new DecimalFormat("###,###,###.##").format(shipMoney) + "<sup>đ</sup>\n" +
                "                                </td>\n" +
                "                            </tr>\n" +
                "                            <tr>\n" +
                "                                <td style=\"font-size: 13px; font-family: 'Open Sans', sans-serif; color: #000; line-height: 28px; vertical-align: top; text-align:right; \">\n" +
                "                                    <strong>Tổng thanh toán: </strong>\n" +
                "                                </td>\n" +
                "                                <td style=\"font-size: 12px; font-family: 'Open Sans', sans-serif; color: #000; line-height: 22px; vertical-align: top; text-align:right; \">\n" +
                "                                    <strong>" + new DecimalFormat("###,###,###.##").format(totalMoney + shipMoney) + "<sup>đ</sup> - $" + new DecimalFormat("###,###,###.##").format((totalMoney + shipMoney) / 23000) + "</strong>\n" +
                "                                </td>\n" +
                "                            </tr>\n" +
                "                            </tbody>\n" +
                "                        </table>\n" +
                "                        <!-- /Table Total -->\n" +
                "\n" +
                "                    </td>\n" +
                "                </tr>\n" +
                "                </tbody>\n" +
                "            </table>\n" +
                "        </td>\n" +
                "    </tr>\n" +
                "    </tbody>\n" +
                "</table>\n" +
                "<!-- /Total -->\n" +
                "<!-- /Information -->\n" +
                "<table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\" class=\"fullTable\" bgcolor=\"#e1e1e1\">\n" +
                "\n" +
                "    <tr>\n" +
                "        <td>\n" +
                "            <table width=\"600\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\" class=\"fullTable\"\n" +
                "                   bgcolor=\"#ffffff\" style=\"border-radius: 0 0 10px 10px;\">\n" +
                "                <tr>\n" +
                "                    <td>\n" +
                "                        <table width=\"480\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\"\n" +
                "                               class=\"fullPadding\">\n" +
                "                            <tbody>\n" +
                "                            <tr>\n" +
                "                                <td style=\"font-size: 12px; color: #5b5b5b; font-family: 'Open Sans', sans-serif; line-height: 18px; vertical-align: top; text-align: left;\">\n" +
                "                                    Chúc bạn 1 ngày tốt lành!\n" +
                "                                </td>\n" +
                "                            </tr>\n" +
                "                            <tr>\n" +
                "                                <td style=\"font-size: 12px; color: #5b5b5b; font-family: 'Open Sans', sans-serif; line-height: 18px; vertical-align: top; text-align: left;\">\n" +
                "                                    Xem thêm các sản phẩm khác <a style=\"font-weight: bold\" target=\"_blank\" href=\"" + apiUrl + "/product/list\">tại đây</a>.\n" +
                "                                </td>\n" +
                "                            </tr>\n" +
                "                            </tbody>\n" +
                "                        </table>\n" +
                "                    </td>\n" +
                "                </tr>\n" +
                "                <tr class=\"spacer\">\n" +
                "                    <td height=\"50\"></td>\n" +
                "                </tr>\n" +
                "\n" +
                "            </table>\n" +
                "        </td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "        <td height=\"20\"></td>\n" +
                "    </tr>\n" +
                "</table>\n" +
                "</body>\n" +
                "</html>\n";

        return template;
    }
}

