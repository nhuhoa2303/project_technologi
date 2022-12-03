package com.example.demo.controller;


import com.example.demo.model.account.AppUser;
import com.example.demo.model.jwt.JwtRequest;
import com.example.demo.model.jwt.JwtResponse;
import com.example.demo.service.account.IAppUserService;
import com.example.demo.service.jwt.AppUserDetailsService;
import com.example.demo.utils.JwtUtils;
import com.example.demo.utils.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;
import java.util.stream.Collectors;


@Controller
@RestController
@CrossOrigin
public class HomeController {
    @Autowired
    private AppUserDetailsService userService;
    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private AuthenticationManager auth;
    @Autowired
    private IAppUserService iAppUserService;
    @Autowired
    private TokenUtil tokenUtil;

    @GetMapping("/")
    public String home() {
        return "Hello JWT";
    }


    @RequestMapping(value = "/authenticate", method = RequestMethod.POST)
    public ResponseEntity<?> createTokenAuthenticate(@RequestBody JwtRequest jwtRequest) throws Exception {
        if (jwtRequest.getUsername() == null || jwtRequest.getPassword() == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        final UserDetails userDetails = userService.loadUserByUsername(jwtRequest.getUsername());
        if(userDetails ==null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        authenticate(jwtRequest.getUsername(), jwtRequest.getPassword());
//        AppUser appUser = this.iAppUserService.findAppUserByUsername(jwtRequest.getUsername());
//        System.out.println(appUser.getCreationDate());
//        Date date = new Date(System.currentTimeMillis());

//        System.out.println(appUser.getCreationDate().toLocalDate().plusDays(30));
//        // Check Password Expired
//        if (date.toLocalDate().compareTo(appUser.getCreationDate().toLocalDate().plusDays(30)) >= 0) {
//            return new ResponseEntity<>("PasswordExpired", HttpStatus.UNAUTHORIZED);
//        }
        // Get roles list
        List<String> grantList = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        // Create token
        final String token = jwtUtils.generateToken(userDetails);

        this.tokenUtil.getTokenMap().put(userDetails.getUsername(), token);

        return ResponseEntity.ok(new JwtResponse(token, grantList, userDetails.getUsername()));
    }


    private void authenticate(String username, String password) throws Exception {
        try {
            auth.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }
}
