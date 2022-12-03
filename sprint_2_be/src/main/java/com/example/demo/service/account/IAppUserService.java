package com.example.demo.service.account;


import com.example.demo.model.account.AppUser;

public interface IAppUserService {

    AppUser findAppUserByUsername(String username);

    void save(AppUser appUser);
}
