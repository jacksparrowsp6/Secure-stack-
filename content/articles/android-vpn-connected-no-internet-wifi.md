---
title: "Android VPN Connected but No Internet on Wi-Fi? Safe Fixes That Isolate the Cause"
description: "Fix Android VPN connected but no internet on Wi-Fi with a safe decision tree for kill switches, DNS, Wi-Fi, IPv6, apps, and network resets."
slug: "android-vpn-connected-no-internet-wifi"
category: "Android & VPN Troubleshooting"
publishedAt: "2026-09-19"
updatedAt: "2026-09-19"
primaryKeyword: "Android VPN connected but no internet on Wi-Fi"
secondaryKeywords:
  - "VPN connected but no internet Android Wi-Fi"
  - "Android VPN no internet access"
  - "Android VPN kill switch Wi-Fi problem"
  - "Android VPN DNS troubleshooting"
  - "Android Wi-Fi connected no internet"
author: "SecureStack Hub Editorial Team"
reviewer: "SecureStack Hub Technical Review Team"
---

# Android VPN Connected but No Internet on Wi-Fi? Safe Fixes That Isolate the Cause

If your Android phone says the VPN is connected but apps and websites have no internet over Wi-Fi, do not start by changing random DNS servers or resetting every network setting. First disconnect the VPN and test the same Wi-Fi connection. If the internet works without the VPN, the likely fault is in the VPN path or a setting that blocks traffic when the tunnel is unavailable. If the internet still fails without the VPN, troubleshoot Wi-Fi or the upstream connection first. This distinction prevents you from masking the real problem.

This guide is for Android phones and tablets; it is not a substitute for the broader [VPN-connected websites troubleshooting guide](/article/vpn-connected-but-websites-wont-load/) or the iPhone-specific procedure. Android’s menu names vary by phone maker and Android version. The paths below use common labels such as **Settings > Network & internet > VPN**, **Settings > Connections > VPN**, and **Settings > Network & internet > Private DNS**. If a label is missing, search for **VPN**, **Always-on VPN**, **Block connections without VPN**, or **Private DNS** in Settings. Google notes that some VPN and network steps are version-dependent. [1] [3]

> **Short answer:** verify that Wi-Fi works without the VPN, then check Android’s **Always-on VPN** and **Block connections without VPN** controls, test for DNS or browser-specific failure, try another VPN server or protocol in the VPN app, and only then forget the Wi-Fi network or reset network settings. Re-enable any privacy protection you temporarily turn off.

## What the symptom usually means

The VPN badge confirms that Android has a VPN interface or that the VPN app reports a session. It does not, by itself, prove that every application can resolve DNS names, reach the requested server, or use the intended route. A kill switch or Android lockdown setting can deliberately block non-VPN traffic. Android documents that **Block connections without VPN** blocks traffic that does not use the VPN; a per-app allow list can also leave apps without a usable network path. [5]

The same symptom can instead come from a Wi-Fi captive portal, a failed router or ISP connection, an invalid DNS configuration, a proxy, a VPN server or protocol problem, or an Android/VPN interaction after moving between Wi-Fi and mobile data. Proton VPN documents a known Android 13 issue affecting some devices and configurations after switching between Wi-Fi and cellular networks; its workarounds are not universal and may need to be repeated. [6]

## Symptom decision tree

Follow this decision tree in order. After each change, disconnect and reconnect the VPN, then test one ordinary webpage and one app that normally uses the internet.

```text
VPN connected, but websites/apps do not load on Wi-Fi
│
├─ 1. Disconnect the VPN and test Wi-Fi
│  ├─ Internet still fails → Wi-Fi/portal/router/ISP branch
│  └─ Internet works → VPN/settings branch
│
├─ 2. On the VPN branch: is Always-on or Block connections without VPN enabled?
│  ├─ Yes → temporarily disable only for diagnosis, reconnect, and retest
│  └─ No → continue
│
├─ 3. Does an IP-address test work while domain names fail?
│  ├─ Yes → DNS, Private DNS, proxy, or VPN DNS handling is implicated
│  └─ No → tunnel route, server, protocol, firewall, or upstream reachability is implicated
│
├─ 4. Does another browser or app work?
│  ├─ Yes → app/browser proxy, secure-DNS, cache, or per-app VPN rule
│  └─ No → system-wide VPN path, Wi-Fi, or device setting
│
└─ 5. Does another VPN server, protocol, Wi-Fi network, or mobile data work?
   ├─ Yes → isolate the failing server, protocol, network, or transition
   └─ No → collect VPN diagnostics and contact the VPN provider; restore settings first
```

### What each test proves—and what it does not

| Test | If it succeeds | If it fails | What it proves | What it does not prove |
|---|---|---|---|---|
| Browse with VPN disconnected on the same Wi-Fi | Wi-Fi has working internet | Wi-Fi or upstream access may be the issue | The VPN is involved when only the VPN state causes failure | That the VPN provider or app is definitely defective |
| Try another device on the same Wi-Fi | Other device browses | Multiple devices fail | Whether the problem is more likely phone-specific or network-wide | That the phone’s VPN settings are correct |
| Try the phone on another Wi-Fi network | Other network works | Every network fails | Whether the original Wi-Fi, portal, or router path is implicated | That the VPN tunnel works on all networks |
| Open a known IP address or run a permitted IP reachability test | IP works while names fail | No IP reachability | A difference between basic reachability and name resolution | That the IP is safe, available, or an appropriate long-term DNS replacement |
| Try another browser or a private/incognito window | Only one browser fails | All browsers fail | Whether the browser profile, proxy, extension, or browser DNS feature is implicated | That the VPN is healthy system-wide |
| Try another VPN server or protocol | New selection works | All selections fail | Whether the original endpoint or transport is implicated | That the replacement server is faster or more private |

On a managed phone, work profile, school network, or enterprise VPN, an administrator may control these settings. Do not remove a managed VPN or change policy without authorization.

## Safe fixes, in the right order

### 1. Establish whether Wi-Fi works without the VPN

Disconnect the VPN from its app, then open a webpage over the same Wi-Fi. Keep mobile data off during this comparison so the result is not silently carried by cellular service. You can also follow Google’s basic comparison: switch between Wi-Fi and mobile data and check whether the behavior changes. [2]

If Wi-Fi fails with the VPN disconnected, follow a Wi-Fi-focused path: turn Wi-Fi off and on, turn Airplane mode on and off, restart the phone, and test another device on that network. Google recommends these checks and uses another device or another network to distinguish a phone problem from a network or internet problem. [4]

If the Wi-Fi requires a sign-in page, disconnect the VPN and complete the captive-portal sign-in first. A VPN can prevent the portal from opening, but the exact behavior depends on the network and VPN app. Do not enter credentials on a page whose address or identity you cannot verify.

**What this test proves:** If the internet returns only when the VPN is disconnected, continue with the VPN branch. If it does not, changing VPN servers is unlikely to fix the underlying Wi-Fi outage.

### 2. Check Android lockdown and kill-switch settings

A kill switch is intended to block traffic rather than allow an unprotected connection. Proton VPN describes it as a feature that blocks internet traffic when the VPN connection drops, protecting the device’s IP address and DNS activity. [7] Android’s own lockdown control is commonly shown as **Block connections without VPN**. [5]

For a temporary diagnosis:

1. Open **Settings** and search for **VPN**.
2. Open the gear or settings control beside the active VPN profile.
3. Note whether **Always-on VPN** or **Block connections without VPN** is enabled.
4. If the VPN is connected but traffic is unusable, turn off these controls temporarily, reconnect the VPN, and test.
5. If internet access returns, the block is doing its job because the tunnel is not carrying usable traffic. Keep the protection off only while you diagnose the VPN, or turn it back on before using untrusted networks.

Some VPN apps link to these Android controls from an in-app **Kill switch** page. Do not assume that a visible “connected” label means the tunnel is carrying traffic; Proton documents that Android’s system controls are part of its kill-switch setup. [7]

**Rollback warning:** Turning off lockdown can permit ordinary traffic if the VPN later drops. It is a diagnostic step, not a privacy recommendation. Record the original toggle state and restore it when testing ends.

### 3. Reconnect cleanly after a Wi-Fi/mobile transition

If the problem began after leaving Wi-Fi, returning to Wi-Fi, or moving between Wi-Fi and cellular data, close the VPN connection deliberately, turn Airplane mode on, wait briefly, turn it off, reconnect to Wi-Fi, and then reconnect the VPN. Google recommends an Airplane mode and restart check for Wi-Fi issues. [4] Proton reports that some Android 13 devices can show a stale VPN-connected state after network switching, with Airplane mode as one reported workaround. [6]

Do not treat this as a permanent Android-wide fix. If the symptom returns after every network transition, update Android and the VPN app, record the Android version and VPN version, and send the provider diagnostic logs rather than repeatedly changing unrelated settings.

### 4. Test DNS and Private DNS without replacing DNS permanently

Domain Name System (DNS) translates a name such as `example.com` into an address. IVPN describes DNS configuration as a common reason a connected VPN cannot browse and recommends comparing reachability to an external IP with name-based browsing. [8]

Use the distinction carefully:

- If an IP reachability test succeeds but normal domain names fail, DNS handling is implicated.
- If both IP reachability and domain browsing fail, a route, VPN tunnel, server, protocol, firewall, or upstream connection is more likely.
- If only one browser fails, inspect that browser’s proxy or secure-DNS settings before changing Android-wide DNS.

For a reversible test, open **Settings**, search for **Private DNS**, and note the current mode. If it is set to a custom provider hostname, return it temporarily to **Automatic**. If the VPN provider specifically instructs you to test with Private DNS off, record the original setting, test once, and restore it afterward. Google documents Private DNS as an advanced network setting, while menu availability varies by Android release. [3]

Avoid treating a public DNS address as a universal fix. A custom resolver changes where DNS requests go and can conflict with the VPN’s DNS design, local network names, parental controls, or enterprise policy. IVPN also warns that using an external resolver may be considered a DNS leak in some VPN configurations. [8]

**Rollback warning:** Restore the original Private DNS mode or hostname after the test unless you have a documented reason to keep the change. Do not copy DNS addresses from an untrusted forum or an unknown VPN guide.

For more context, see SecureStack Hub’s guide to [Android Private DNS troubleshooting](/article/vpn-connected-but-websites-wont-load/).

### 5. Remove a proxy or browser-only setting

A proxy can stop browsing even when the VPN interface is present. Check the connected Wi-Fi network’s advanced settings for a proxy and set it to **None** only if you did not intentionally configure one. IVPN also recommends checking browser proxy configuration and trying another browser or a private window. [8]

If one browser works and another does not, inspect the failing browser’s secure-DNS mode, proxy, extensions, content filters, and cached site data. Do not clear all app data until you have recorded saved sessions and settings.

**What this test proves:** A working second browser points toward browser-level configuration. It does not prove that every app is permitted through the VPN or that the VPN is healthy for system traffic.

### 6. Check VPN app routing, per-app rules, and server selection

Android VPN apps can use per-app allow or disallow lists. Android Developers notes that an allow list can restrict VPN traffic to selected installed apps; apps outside the intended list can therefore appear offline. [5] Open the VPN app and temporarily disable split tunneling or app exclusions, if you enabled them, then reconnect and test.

Next, select a different VPN server or protocol using the app’s documented options. Test one change at a time. If only one server or protocol fails, record that result for the provider. If every server fails on one Wi-Fi network but works on mobile data, the Wi-Fi network may be filtering or interrupting the VPN transport; the VPN provider can advise which supported protocol is appropriate.

Avoid disabling security features permanently just to make a single app work. If you need local printer, casting, or home-device access, use the provider’s documented local-network or split-tunneling controls and understand which traffic is intentionally outside the tunnel.

For a broader explanation of tunnel routing and leak protection, see [how a VPN kill switch changes Android connectivity](/article/vpn-connected-but-websites-wont-load/).

### 7. Update and restart before resetting network state

Install available Android system and VPN-app updates, then restart the phone. Google recommends checking for the latest system update after reconnection because updates can include connectivity improvements. [4] Also check whether the VPN account is active and whether the provider reports an outage or maintenance window.

This step is low risk compared with a network reset, but it is not a guarantee. If the issue started immediately after an update, record the update number and provider app version. That information is more useful to support than a general report that “the VPN does not work.”

### 8. Forget and rejoin the Wi-Fi network

If Wi-Fi works inconsistently even with the VPN disconnected, remove and re-add the saved network. Open **Settings > Network & internet > Internet**, select the connected Wi-Fi network, and choose **Forget** or **Remove**. Reconnect with the correct password. Google documents the standard Wi-Fi connection and saved-network controls; exact labels vary by device. [9]

This can clear a stale saved profile, but it also removes the saved password and network-specific settings. If the network is managed, ask the administrator for the correct configuration before forgetting it.

For related symptoms, use [Android Wi-Fi connected but no internet troubleshooting](/article/vpn-kills-wifi-connection/).

### 9. Reset network settings only as the last device-side step

A network reset can help when Wi-Fi, mobile-network, Bluetooth, or saved configuration state is inconsistent, but it is more disruptive than the earlier tests. On many phones it appears under **Settings > System > Reset options** with a name such as **Reset Wi-Fi, mobile & Bluetooth** or **Reset Bluetooth & Wi-Fi**. Google’s Pixel guidance includes a reset-all-network-settings option after less destructive checks. [4]

Before confirming, make sure you have:

- Wi-Fi passwords or access to a password manager.
- Any carrier or enterprise network details needed to reconnect.
- The VPN account, profile, certificate, or QR code required to re-add the VPN.
- A record of the current Private DNS, proxy, Always-on VPN, and lockdown states.

A network reset does not establish that the VPN provider is at fault. If the VPN still fails after the reset while ordinary Wi-Fi works, stop making broad changes and collect the provider’s diagnostic logs.

## When to stop troubleshooting and escalate

Contact the VPN provider when the issue persists across multiple servers and protocols, the same VPN fails on more than one working network, or the app reports a connection while Android shows no usable traffic. Include the device model, Android version, VPN app version, server and protocol, time of failure, whether Wi-Fi works without the VPN, and whether the issue follows Wi-Fi-to-cellular switching.

Contact the network administrator or internet service provider when multiple devices fail on the same Wi-Fi, a captive portal will not complete without the VPN, or another network works normally. For a work or school device, follow its support process before changing managed VPN or DNS settings.

Do not send passwords, private keys, recovery codes, or full browsing histories in a diagnostic report. Redact them from screenshots and logs.

## FAQ

### Why does my Android VPN say connected when nothing loads?

The connected label indicates a VPN interface or app session, not successful DNS resolution and application traffic. Android lockdown can block non-VPN traffic, and a VPN app’s routing or per-app rules can leave some traffic without a usable path. First compare browsing with the VPN disconnected on the same Wi-Fi, then check the lockdown settings and DNS distinction. [5] [8]

### Should I turn off the VPN kill switch?

Only temporarily for diagnosis, and only if you understand the trade-off. A kill switch is designed to block traffic when the VPN is unavailable so that traffic does not fall back to the ordinary connection. Turning it off may restore internet access, but it removes that block. Restore the original setting after testing. [7]

### Can Private DNS cause a VPN to have no internet on Wi-Fi?

It can be involved in a name-resolution failure, especially when a custom Private DNS provider conflicts with the VPN’s DNS handling. Test by recording the current mode and returning it temporarily to **Automatic**, or follow the VPN provider’s documented diagnostic step. A Private DNS change is not a guaranteed fix and should not be left altered without a reason. [3] [8]

### Why does the VPN work on mobile data but not on Wi-Fi?

The difference points to a network-specific factor, such as a captive portal, router filtering, DNS behavior, or VPN transport compatibility. It does not identify which factor by itself. Test the VPN on another Wi-Fi network and try another supported VPN server or protocol, one change at a time.

### Why did the problem begin after switching between Wi-Fi and mobile data?

Some Android and VPN-app combinations can retain a stale connection state after a network transition. Proton documents this as a known issue affecting some Android 13 configurations and lists reconnecting, Airplane mode, and other provider-specific workarounds. Treat those as reported workarounds, not universal fixes. [6]

### Will forgetting Wi-Fi delete my VPN?

Forgetting a Wi-Fi network normally removes that saved Wi-Fi profile, not the VPN account or app. However, a full network reset can remove broader network state and may require you to reconnect Wi-Fi, mobile-network, Bluetooth, or VPN profiles. Record your settings before resetting.

### Is changing DNS to 1.1.1.1 or 8.8.8.8 the best fix?

No single DNS address is a guaranteed fix. An IP-versus-domain test can show whether name resolution is implicated, but changing resolvers can affect privacy, local names, filtering, and VPN DNS protections. Use the VPN provider’s instructions and restore the original configuration if the test does not help. [8]

### What if nothing works?

Restore temporary changes, confirm that ordinary Wi-Fi works without the VPN, and contact the VPN provider with reproducible test results and redacted diagnostics. If ordinary Wi-Fi also fails, work with the router administrator or ISP instead. Avoid repeated network resets because they erase useful configuration evidence.

## References

[1]: https://support.google.com/android/answer/9089766?hl=en-gb "Connect to a virtual private network (VPN) on Android"
[2]: https://support.google.com/android/answer/2651367?hl=en "Fix internet connection problems on Android devices"
[3]: https://support.google.com/android/answer/9654714?hl=en "Manage advanced network settings on your Android phone"
[4]: https://support.google.com/pixelphone/answer/6183600?hl=en "How to fix Wi-Fi connection problems"
[5]: https://developer.android.com/develop/connectivity/vpn "VPN | Connectivity - Android Developers"
[6]: https://protonvpn.com/support/connection-issues-android-13/ "Connection issues on Android 13"
[7]: https://protonvpn.com/support/what-is-kill-switch "How to use kill switch"
[8]: https://www.ivpn.net/knowledgebase/troubleshooting/my-vpn-is-connected-but-i-cannot-browse-the-internet-why/ "My VPN is connected but I cannot browse the Internet, why?"
[9]: https://support.google.com/android/answer/9075847?hl=en "Connect to Wi-Fi networks on your Android device"
