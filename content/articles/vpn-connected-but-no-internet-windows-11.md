---
title: "VPN Connected but No Internet on Windows 11: Safe Fixes and Tests"
description: "VPN connected but no internet on Windows 11? Follow this decision tree to isolate DNS, routing, proxy, adapter, and VPN-policy causes before using disruptive resets."
slug: "vpn-connected-but-no-internet-windows-11"
category: "Windows Networking"
publishedAt: "2026-09-19"
updatedAt: "2026-09-19"
primaryKeyword: "VPN connected but no internet Windows 11"
secondaryKeywords:
  - "Windows 11 VPN connected no internet fix"
  - "VPN connected but cannot browse Windows 11"
  - "Windows 11 VPN DNS problem"
  - "Windows 11 VPN default gateway"
  - "Windows 11 network reset VPN"
author: "SecureStack Hub Editorial Team"
reviewer: "Windows Networking Reviewer"
---

# VPN Connected but No Internet on Windows 11: Safe Fixes and Tests

If your **VPN says Connected but Windows 11 has no internet**, first disconnect the VPN and test one ordinary website. If the internet works when the VPN is off, the likely fault is in the VPN’s route, DNS, proxy, kill-switch policy, or client configuration—not necessarily your Wi-Fi. If the internet also fails with the VPN disconnected, troubleshoot the underlying Wi-Fi or Ethernet connection before changing VPN settings.

The safest order is to **test before resetting**: compare VPN on and off, check an IP address and a hostname, inspect the proxy setting, restart the VPN connection, then use Windows’ documented network commands. Leave Network reset and driver removal until later because they change adapter configuration and can require you to reinstall or reconfigure VPN software.

> This guide is specifically for Windows 11 system-wide internet failure; for a browser-only symptom without an OS-specific diagnosis, use the broader [VPN-connected websites troubleshooting guide](/article/vpn-connected-but-websites-wont-load/). It covers Windows 11 built-in VPN profiles and third-party VPN apps. Work or school VPNs may enforce routing, DNS, proxy, or kill-switch policies that only the VPN administrator can change.

## Quick symptom decision tree

Use the branches below rather than applying every fix at once. A test result narrows the cause; it does not prove that every other component is healthy.

```text
VPN disconnected: can you open a normal website?
├─ No → Fix the base Wi-Fi/Ethernet connection first.
│      Check the gateway, run Windows' troubleshooter, and test another device.
└─ Yes → Connect the VPN and test again.
        ├─ No IP ping and no hostname access → VPN tunnel, route, firewall,
        │                                      kill switch, or server policy.
        ├─ IP ping works, hostname fails → DNS or DNS-policy problem.
        ├─ Browser fails but another app works → proxy, browser, or extension.
        ├─ Public internet fails but work resources work → full-tunnel policy,
        │                                                   gateway, or split routing.
        └─ Only one VPN server or protocol fails → VPN endpoint, protocol,
                                                        or provider-side issue.
```

### The three-minute comparison

1. Disconnect the VPN.
2. Open two unrelated HTTPS websites. If possible, also try a non-browser app such as Windows Update or an email client.
3. Open **Command Prompt** and run:

   ```text
   ipconfig
   ping <default-gateway-address>
   ping 1.1.1.1
   ping example.com
   ```

   Replace `<default-gateway-address>` with the address shown beside **Default Gateway** for your active Wi-Fi or Ethernet adapter. Microsoft describes `ping` as an IP-level connectivity, reachability, and name-resolution diagnostic; a successful IP ping followed by a failed name ping points toward name resolution, but a failed ping alone does not prove that web traffic is impossible because hosts and firewalls can filter ICMP. [1] [2]

4. Connect the VPN and repeat `ping 1.1.1.1` and `ping example.com`.
5. Note the exact change. For example, “IP address replies with VPN off but not on” is more useful than “the internet is broken.”

## What each test proves

| Test | If it succeeds | If it fails | What it does not prove |
| --- | --- | --- | --- |
| Open a site with VPN disconnected | The base connection can reach at least that web service | The base connection, DNS, browser, or captive portal may be at fault | That the VPN itself is configured correctly |
| `ping <default-gateway>` | The device can reach the local router at the IP layer | A local Wi-Fi/Ethernet, adapter, or gateway path problem is possible | That the router has working internet access |
| `ping 1.1.1.1` or another known public IP | A route to that IP and an ICMP reply exist | The VPN route, firewall, upstream path, or ICMP filtering may be involved | That DNS or HTTPS works |
| `ping example.com` | The name was resolved and an ICMP reply arrived | DNS, name resolution, or ICMP filtering may be involved | That every website or browser request works |
| `nslookup example.com` | A DNS server returned an answer, if the command reports one | DNS server selection, reachability, or policy may be involved | That the resulting web server accepts HTTPS |
| A second browser or app | The original browser, proxy, extension, or app may be the issue | The problem is more likely system-wide or VPN-wide | That a VPN tunnel is carrying all traffic |
| `ipconfig /all` | You can inspect addresses, gateways, and DNS servers for each adapter | Missing or unexpected values provide a lead | That a displayed VPN address is routable to the public internet |

## Safe, ordered fixes

### 1. Confirm whether the VPN is the trigger

Disconnect the VPN and browse again. Then reconnect and test the same site or command. If the connection fails only while the VPN is connected, do not start by resetting Windows networking. Record the VPN app or profile name, server or region, protocol if shown, and whether the failure affects every website or only some destinations.

If the connection fails with and without the VPN, use SecureStack Hub’s guide to [fix Wi-Fi connected but no internet on Windows 11](/article/vpn-kills-wifi-connection/) before continuing. A VPN cannot restore a broken underlying connection.

### 2. Check for a captive portal or restricted network

Hotels, airports, schools, and some office guest networks may require sign-in before general internet access. Disconnect the VPN, open a browser, and complete the network’s sign-in page. Reconnect the VPN only after the base connection works.

Do not enter credentials into a page that appears unexpectedly or has an unfamiliar domain. If the network is managed by an employer, school, or venue, follow its access instructions rather than bypassing its controls.

### 3. Check Windows and VPN proxy settings

A stale manual proxy can make a connected VPN appear unusable. In Windows 11, open **Settings > Network & internet > Proxy**. Review **Automatic proxy setup**, any setup script, and **Manual proxy setup**. Turn off a manual proxy only if you do not need it for work or school; Microsoft notes that organizations may require a proxy and that VPN proxy settings are configured separately. [3]

For a Windows-managed VPN profile, open **Settings > Network & internet > VPN**, select the profile, choose **Advanced options**, and review its proxy settings. For a third-party VPN, inspect the app’s proxy, browser, split-tunneling, and kill-switch settings. Do not guess at corporate proxy values; ask the administrator for the intended configuration.

A useful test is to open a second browser with extensions disabled or use another network-aware app. If only one browser fails, reset that browser’s proxy or extension configuration rather than changing the Windows network stack.

### 4. Reconnect, then try a different VPN endpoint or protocol

Disconnect the VPN completely, wait a few seconds, and reconnect. If the app offers another server or protocol, try one approved by the provider or your organization. A single endpoint can be unavailable, overloaded, misrouted, or subject to a temporary policy change.

This comparison is diagnostic, not a guarantee. If one endpoint works and another does not, save the failing endpoint and protocol details for the provider or IT team. Do not disable security features permanently just to make browsing work.

### 5. Check DNS without changing it first

With the VPN connected, run:

```text
ipconfig /all
nslookup example.com
ping 1.1.1.1
ping example.com
```

If `ping 1.1.1.1` returns replies but `ping example.com` cannot resolve the name, DNS is a plausible cause. A VPN may intentionally install its own DNS servers to resolve private work names. Do not replace them with a public DNS service on a work VPN unless the administrator or provider instructs you; doing so can break internal names or conflict with the VPN’s security model.

For a personal VPN, disconnect the VPN and reconnect the ordinary network first. Then open **Command Prompt as administrator** and run:

```text
ipconfig /flushdns
```

Microsoft documents `/flushdns` as flushing and resetting the DNS client resolver cache, including negative cache entries. [1] Reconnect the VPN and retest. This clears cached answers; it does not repair a disabled DNS service, an unreachable VPN DNS server, or a provider-side outage.

### 6. Reset the Windows networking components in Microsoft’s documented order

Use this step only after recording your current VPN, proxy, and adapter settings. Open **Command Prompt** by searching for `command prompt`, choose **Run as administrator**, and run these commands one at a time:

```text
netsh winsock reset
netsh int ip reset
ipconfig /release
ipconfig /renew
ipconfig /flushdns
```

Microsoft lists this sequence for resetting the TCP/IP stack, releasing and renewing an address, and flushing the DNS resolver cache. [4] The Winsock command resets the Winsock catalog to a clean state and removes custom Layered Service Providers, which can address corruption but may affect software that installed network providers. [5]

Restart Windows when prompted or after the commands complete, then test the base connection before reconnecting the VPN. `ipconfig /release` and `/renew` are intended mainly for adapters configured to obtain an address automatically; they may not change a static configuration or a VPN-assigned address. [1]

### 7. Reinstall or repair the VPN client only when its installation is suspect

Use the VPN app’s **Repair**, **Reset**, or reinstall option if the problem began after an app update, an incomplete uninstall, or a damaged virtual adapter. Before removing it, export or record the profile details if your organization permits that. Download the installer from the provider or your organization, not from a third-party mirror.

If you use a work VPN, stop at this point and contact IT before removing certificates, device-management profiles, or security software. A successful connection indicator only confirms that the profile authenticated or that a tunnel interface was created; it does not confirm that the organization’s routes and DNS policies are correct.

### 8. Check the network adapter and driver, with a rollback plan

If the problem began immediately after a Windows or driver update, open **Device Manager > Network adapters** and identify the physical Wi-Fi or Ethernet adapter. Microsoft recommends having a driver backup available before uninstalling an adapter, especially when the PC cannot reach the internet; after restart, Windows may reinstall the adapter driver automatically. [4]

Do not uninstall a VPN virtual adapter casually. Identify whether the entry is the physical adapter or the VPN’s virtual adapter, and save the manufacturer and model. If you cannot obtain the correct driver or do not have local administrator access, ask the PC manufacturer or IT team for help first.

### 9. Use Windows Network reset last

Open **Settings > Network & internet > Advanced network settings > Network reset**. Treat this as a last resort. Microsoft states that Network reset removes installed network adapters and their settings, restarts the PC, and reinstalls adapters with default settings. [4]

Before selecting **Reset now**, record Wi-Fi credentials, static IP settings, custom DNS, proxy details, VPN profiles, VPN certificates, virtual switch settings, and any third-party network-filter software. After the restart, you may need to reinstall or reconfigure VPN software and reconnect to Wi-Fi. Network reset can remove a symptom while also erasing the configuration needed to diagnose a managed VPN.

## Routing: when a VPN intentionally blocks ordinary internet access

Some work VPNs use a full-tunnel policy: internet traffic is sent through the organization’s network. Other profiles use split tunneling: only specified corporate destinations use the VPN while ordinary internet traffic uses the local connection. The intended behavior is controlled by the VPN profile, server, or organization’s security policy.

Microsoft documents a related routing failure in which using the default gateway on the remote network overrides the local default gateway. Its documented design is to use the local gateway for internet traffic and add routes for remote-network traffic, but the exact setting and route belong to the VPN administrator. [6] Do not manually add a persistent route from a guess or copy a route from another organization.

If internal work resources open but public websites do not, the VPN may be enforcing full tunneling or its remote gateway may not be forwarding internet traffic. If public websites open but internal resources do not, the profile may have an incorrect route, DNS suffix, or split-tunnel policy. Send the administrator the results of the VPN-off/VPN-on comparison, `ipconfig /all`, and the destination that failed. Redact usernames, public IP addresses, internal hostnames, and certificate details before sharing logs publicly.

## Rollback warnings before changing settings

- **Proxy:** Write down the previous automatic-detection, script, and manual values. A company proxy may be required even if it prevents ordinary browsing when the VPN is misconfigured.
- **DNS:** Do not substitute public DNS for work VPN DNS without approval. It can stop private-name resolution and may violate organizational policy.
- **Winsock and TCP/IP resets:** These change shared Windows networking components. Expect a restart and possible effects on network-filtering or authentication software.
- **Routes:** Avoid `route -p add` unless an administrator supplied the destination, mask, gateway, and persistence requirement. A persistent route survives restart and can send traffic to the wrong network.
- **Adapter drivers:** Download a matching driver first. Keep a copy on removable media if the PC may be offline.
- **Network reset:** Expect Wi-Fi, VPN, virtual adapter, static IP, DNS, proxy, and virtual-machine networking settings to require reconfiguration.
- **Kill switch:** Do not leave a VPN kill switch disabled as a permanent workaround. If it is blocking traffic by design, resolve the tunnel or policy problem with the provider or administrator.

## When to contact the VPN provider or IT team

Escalate when the VPN connects but every public IP test fails, when only a managed VPN is affected, when the problem started after a server or policy change, or when the profile uses certificates, device compliance, or a required proxy. Include the Windows 11 version, VPN client and version, endpoint and protocol, time of failure, whether VPN-off browsing works, and the redacted test results. Avoid posting VPN logs that contain credentials, tokens, private hostnames, or internal IP ranges.

For more background, see our guides on [DNS troubleshooting on Windows](/article/vpn-connected-but-websites-wont-load/), [how VPN kill switches work](/article/vpn-connected-but-websites-wont-load/), and [Windows network reset and recovery](/article/vpn-kills-wifi-connection/).

## Frequently asked questions

### Why does my VPN say connected when I cannot browse?

“Connected” can describe successful authentication or an established tunnel interface. It does not necessarily mean that the VPN has a working public-internet route, usable DNS, proxy access, or permission to carry all destinations. Compare an IP test and a hostname test with the VPN on and off.

### Is the problem always DNS?

No. DNS is one possibility, especially when a public IP responds but a hostname does not. A failed public IP test can instead indicate a route, firewall, kill-switch, remote gateway, VPN endpoint, or ICMP-filtering issue. Use more than one test and avoid treating one timeout as conclusive.

### Should I change my DNS to 8.8.8.8 or 1.1.1.1?

Not as a first step, and not on a managed work VPN without approval. A VPN can require its own DNS servers for internal names and policy enforcement. Flush the cache first, then ask the provider or administrator which DNS behavior is expected.

### Can Windows Network reset fix a VPN with no internet?

It can help when Windows adapter or network-component configuration is damaged, but it is disruptive and does not correct an incorrect VPN server policy. Microsoft recommends Network reset as a last step because it removes adapters and settings and restores defaults. [4]

### Why does internet work when the VPN is off but not when it is on?

The VPN changes routes, DNS, proxy handling, firewall filtering, or traffic policy. The most useful next comparison is `ping 1.1.1.1` versus `ping example.com` with the VPN connected. Then inspect the VPN’s endpoint, protocol, split-tunnel/full-tunnel setting, kill switch, and administrator-provided policy.

### Is it safe to run `netsh winsock reset`?

It is a documented Windows troubleshooting command, but it changes the Winsock catalog and normally requires a restart. It may affect software that installed custom network providers. Record any unusual network software and be prepared to repair or reinstall it if the issue continues. [5]

### What if only one website fails?

Test a second website, another browser, and the site’s IP only if you know it is safe and current. One site can be down, block the VPN’s exit address, require a particular DNS answer, or be affected by browser state. Do not infer that Windows has no internet from one unavailable domain.

## References

[1]: https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ipconfig "Microsoft Learn: ipconfig command"
[2]: https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ping "Microsoft Learn: ping command"
[3]: https://support.microsoft.com/en-us/windows/experience/connectivity-networking/use-a-proxy-server-in-windows "Microsoft Support: Use a proxy server in Windows"
[4]: https://support.microsoft.com/en-us/windows/experience/connectivity-networking/fix-wi-fi-connection-issues-in-windows "Microsoft Support: Fix Wi-Fi connection issues in Windows"
[5]: https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/netsh-winsock "Microsoft Learn: netsh winsock command"
[6]: https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/cannot-connect-to-internet-vpn-server "Microsoft Learn: You can't connect to the Internet after you connect to a VPN server"
[7]: https://support.microsoft.com/en-us/windows/experience/connectivity-networking/connect-to-a-vpn-in-windows "Microsoft Support: Connect to a VPN in Windows"
[8]: https://www.ivpn.net/knowledgebase/troubleshooting/my-vpn-is-connected-but-i-cannot-browse-the-internet-why/ "IVPN Help Center: My VPN is connected but I cannot browse the Internet, why?"

*Editorial note: Windows menus and VPN-client options can vary by Windows 11 release, device management policy, and VPN provider. The commands and settings above are presented as diagnostic steps, not a promise that one fix will resolve every VPN configuration.*

## Related SecureStack Hub guides

- [Fix Wi-Fi connected but no internet on Windows 11](/article/vpn-kills-wifi-connection/)
- [DNS troubleshooting on Windows](/article/vpn-connected-but-websites-wont-load/)
- [How VPN kill switches work](/article/vpn-connected-but-websites-wont-load/)
- [Windows network reset and recovery](/article/vpn-kills-wifi-connection/)

> **Bottom line:** If Windows 11 has internet with the VPN off but not with it on, preserve the configuration, run the IP-versus-hostname tests, check proxy and VPN policy, and escalate routing or DNS changes to the VPN provider or administrator before using Network reset.
