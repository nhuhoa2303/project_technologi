package com.example.demo.service.account.impl;


import com.example.demo.model.account.AppUser;
import com.example.demo.repository.IAppUserRepository;
import com.example.demo.service.account.IAppUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AppUserService implements IAppUserService {
    @Autowired
    private IAppUserRepository iAppUserRepository;

    @Override
    public AppUser findAppUserByUsername(String username) {
        return this.iAppUserRepository.getAppUserByUsername(username);
    }

    @Override
    public void save(AppUser appUser) {
        this.iAppUserRepository.save(appUser);
    }
}
