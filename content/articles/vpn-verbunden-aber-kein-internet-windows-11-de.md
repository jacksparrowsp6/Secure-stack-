---
title: "VPN verbunden, aber kein Internet unter Windows 11: Sichere Tests"
description: "VPN verbunden, aber kein Internet unter Windows 11? Prüfe DNS, Routing, Proxy, Kill Switch und VPN-Adapter in einer sicheren Reihenfolge."
slug: vpn-verbunden-aber-kein-internet-windows-11
locale: de
category: "Windows-Netzwerk"
primaryKeyword: "VPN verbunden aber kein Internet Windows 11"
secondaryKeywords: "VPN verbunden kein Internet Windows 11 beheben | Windows 11 VPN Verbindung steht aber Webseiten laden nicht | VPN trennt Internet nach dem Verbinden Windows 11 | Windows 11 VPN DNS Problem | VPN Kill Switch blockiert Internet Windows 11"
publishedAt: "2026-09-21"
updatedAt: "2026-09-21"
author: "SecureStack Hub Redaktion"
reviewer: "Native German Technical Review"
translationMode: native-localization
---

# VPN verbunden, aber kein Internet unter Windows 11: Sichere Tests

## Direkte Antwort

Wenn Windows 11 anzeigt, dass das VPN verbunden ist, aber Webseiten oder Online‑Dienste nicht laden, gehen Sie geordnet vor: erst einfache, risikoarme Tests (anderes Gerät, Browser, VPN trennen), dann DNS‑ und Proxy‑Prüfungen, anschließend IP‑/Routing‑Checks und zuletzt eingreifende Maßnahmen wie Adapter‑Reset oder `netsh`. Auf verwalteten (Firma/Schule) Geräten holen Sie vorher die Freigabe der IT ein — Änderungen können Sicherheitsrichtlinien verletzen.

## Drei‑Minuten‑Entscheidungsbaum (Kurzcheck)

- Minuten 0–1: VPN kurz trennen. Läuft das Internet ohne VPN? Ja → Fehler liegt beim VPN/Server/DNS. Nein → lokales Netzwerkproblem.
- Minuten 1–2: Anderes Gerät oder anderer Browser testen. Lädt eine Seite per IP (siehe „IP‑Reichweite“)?
- Minuten 2–3: Einstellungen > Netzwerk & Internet > VPN prüfen: Ist die Verbindung sichtbar? VPN‑App kurz neu starten. Bei Managed Devices: IT kontaktieren.

Hinweis: Ein erfolgreiches Ping/ICMP bedeutet nicht automatisch, dass HTTPS/HTTP oder DNS funktionieren. Ping zeigt nur Erreichbarkeit auf IP‑Ebene.

---

## Symptome kurz und typische Ursachen

- VPN verbunden, aber keine Webseiten: Häufige Ursachen sind fehlerhafte DNS‑Auflösung über das VPN, fehlende Default‑Route, aktiver Kill Switch oder VPN‑Server ohne NAT/Forwarding.
- Nur interne Ressourcen erreichbar, externe nicht: Vermutlich Split‑Tunneling deaktiviert oder Routing/DNS so konfiguriert, dass nur Firmennetze erreichbar sind.
- Lokales Heimnetzwerk (Drucker/NAS) nicht mehr erreichbar: Kill Switch oder Richtlinie, die lokalen Verkehr blockiert.

---

## Vorbereitung und Sicherheits‑Hinweise

- Privatgerät vs. verwaltetes Gerät: Auf privaten Geräten dürfen Sie Netzwerkeinstellungen ändern. Auf verwalteten Geräten sprechen Sie zuerst mit Ihrer IT.
- Erstellen Sie vor größeren Eingriffen einen Wiederherstellungspunkt: Einstellungen > System > Wiederherstellung > Wiederherstellungspunkt erstellen.
- Notieren oder fotografieren Sie IP‑/DNS‑/Gateway‑Einstellungen, bevor Sie sie ändern.

---

## Geordnete Diagnose (von risikoarm zu eingreifend)

### 1) Basischecks (risikoarm)

- Testen Sie mehrere Ziele: z. B. https://www.example.com und eine weitere Domain.
- Wechseln Sie das Gerät: Funktioniert Internet mit aktiviertem VPN auf einem zweiten Gerät im gleichen Netzwerk? Wenn ja → Problem am ersten Client.
- VPN trennen: Läuft Internet ohne VPN normal? Wenn ja → Problem im VPN‑Client/Server/DNS/Routing.

### 2) IP‑Reichweite prüfen (ICMP/Ping)

Wichtig: Ping beweist nicht, dass Web‑Zugriff (HTTPS/HTTP/DNS) funktioniert. Es zeigt nur, dass IP‑Pakete zurückkommen können.

- Eingabeaufforderung öffnen: Start → „cmd“ → Eingabeaufforderung (als Benutzer). Für manche Befehle ist erhöhte Eingabeaufforderung nötig.
- Beispiel: `ping 8.8.8.8 -n 4`
  - Wenn 8.8.8.8 antwortet, ist IP‑Routing zur Adresse grundsätzlich möglich. ICMP kann aber durch Firewalls geblockt sein.

### 3) DNS prüfen (häufige Ursache)

- DNS mit `nslookup` prüfen: In der Eingabeaufforderung `nslookup www.google.com` eingeben.
  - `nslookup` zeigt, welcher DNS‑Server genutzt wird und welche IP(s) aufgelöst wurden.
- Test: DNS‑Abfrage gegen öffentlichen Resolver erzwingen: `nslookup www.example.com 1.1.1.1` oder `nslookup www.example.com 8.8.8.8`.
  - Funktioniert die Abfrage mit einem öffentlichen DNS, aber nicht ohne Angabe, ist die System‑DNS‑Konfiguration oder die vom VPN erzwungene DNS‑Einstellung fehlerhaft.

Hinweis: Viele Unternehmens‑VPNs setzen interne DNS‑Server; das ist normal, sofern diese antworten.

### 4) HTTPS / Browser‑Ebene

- Browser wechseln oder Inkognito/Privatmodus testen. Add‑ons (z. B. Proxy‑Erweiterungen) können stören.
- Kurz testen per Header‑Anfrage: `curl -I https://www.example.com` (sofern curl vorhanden). Alternativ PowerShell: `Invoke-WebRequest -Uri 'https://www.example.com' -Method Head`.
  - Fehler hier deuten auf TLS/Proxy/Firewall‑ oder HTTPS‑Interception‑Probleme hin.

### 5) Proxy‑Einstellungen prüfen

- Windows 11: Einstellungen > Netzwerk & Internet > Proxy. Prüfen Sie, ob ein manueller Proxy aktiviert ist. Auf Browser‑Ebene (z. B. Firefox) sind eigene Proxy‑Einstellungen möglich.

### 6) Kill Switch und VPN‑Client‑Einstellungen

- Viele VPNs haben einen „Kill Switch“, der bei Tunnelproblemen den gesamten Datenverkehr blockiert. Prüfen Sie in der VPN‑App unter Einstellungen / Schutz / Sicherheit, ob der Kill Switch aktiv ist. Deaktivieren Sie ihn nur kurzfristig zur Diagnose.
- Warnung: Während der Deaktivierung kann Ihre echte IP sichtbar werden. Vorgehensweise nur temporär verwenden.

### 7) Routing und Standard‑Gateway prüfen

- In der Eingabeaufforderung `route print` ausführen. Achten Sie auf die Standardroute `0.0.0.0`. Bei Full‑Tunnel‑VPN sollte die Default‑Route über das VPN‑Gateway zeigen; bei Split‑Tunnel bleibt sie lokal.
- Fehlt die Default‑Route nach dem Verbinden, kann das den gesamten Internetzugang blockieren.

### 8) VPN‑Adapter prüfen

- Einstellungen > Netzwerk & Internet > Adapteroptionen anzeigen: Hier sehen Sie den VPN‑Adapter. Rechtsklick → Status zeigt Übertragungsstatistiken.
- Geräte‑Manager > Netzwerkadapter: Prüfen Sie auf gelbe Warnsymbole oder deaktivierte Einträge.
- Adapter deaktivieren/aktivieren oder in der VPN‑App „Reparieren“/Neuinstallation versuchen.

### 9) Windows‑Firewall und Drittanbieter‑Firewall

- Windows‑Sicherheit: Einstellungen > Datenschutz & Sicherheit > Windows‑Sicherheit > Firewall & Netzwerkschutz. Unter „App durch Firewall zulassen“ den VPN‑Client prüfen.
- Drittanbieter‑Antivirenprogramme können eigene Firewall‑Regeln haben. Temporär deaktivieren nur auf privatem Gerät und nur kurz zum Testen.

### 10) Microsoft‑Netzwerk‑Kommandosequenz (vorsichtig verwenden)

Warnung: Die folgenden Befehle setzen Netzwerk‑Stacks zurück. Auf verwalteten Geräten NICHT ohne Zustimmung der IT ausführen. Legen Sie vorher einen Wiederherstellungspunkt an und notieren Sie statische Einstellungen.

Empfohlene, gestaffelte Reihenfolge (mit Neustart dazwischen):

1. `ipconfig /release`
2. `ipconfig /renew`
3. `ipconfig /flushdns`
4. `ipconfig /registerdns`
5. `netsh winsock reset`
6. `netsh int ip reset`

- Nach den Befehlen PC neu starten. `netsh winsock reset` und `netsh int ip reset` haben kein einfaches "Undo"; Wiederherstellung läuft über den Wiederherstellungspunkt oder manuelles Neu‑Konfigurieren zuvor notierter Werte.

Quellen zu Befehlen: Microsoft Dokumentation zu `ipconfig` und `netsh` (siehe Quellen am Ende).

### 11) Provider‑ oder Serverseitige Probleme

- Prüfen Sie die Status‑/Supportseiten Ihres VPN‑Anbieters. Manche Server erlauben zwar Authentifizierung, aber kein NAT/Internet‑Forwarding.
- Wechseln Sie testweise zu einem anderen VPN‑Serverstandort. Funktioniert ein anderer Server, liegt es am ursprünglichen Server.

---

## Spezielle Hinweise für Unternehmens‑VPNs

- Managed Devices und Firmen‑VPNs können DNS‑ und Routing‑Richtlinien erzwingen. Änderungen am Client können Ihre Authentifizierung oder Compliance verletzen.
- Bei Fragen zu Zertifikaten, internen DNS‑Servern oder Routen: IT‑Helpdesk kontaktieren. Änderungen ohne Rücksprache können den Zugang zur Unternehmensinfrastruktur unterbrechen.

---

## Praxis‑Checkliste (zum Abhaken)

- [ ] Internet ohne VPN testen
- [ ] Anderes Gerät im selben Netzwerk testen
- [ ] `nslookup` ausführen und Ergebnis notieren
- [ ] Proxy‑Einstellungen kontrollieren
- [ ] Kill Switch in VPN‑App prüfen
- [ ] VPN‑Adapterstatus in Adapteroptionen prüfen
- [ ] Firewall‑Regeln für VPN‑Client prüfen
- [ ] `ipconfig /flushdns` und nur bei Bedarf `netsh winsock reset` (nach Wiederherstellungspunkt)
- [ ] Anderen VPN‑Server probieren oder Anbieter kontaktieren

---

## Häufige Fehlerbeispiele und gezielte Lösungen

- DNS‑Timeout (nslookup zeigt Timeout): Prüfen, ob der VPN‑Client DNS‑Server setzt. Temporär Systems‑DNS manuell setzen: Einstellungen > Netzwerk & Internet > Adapteroptionen anzeigen → Adaptereigenschaften → Internetprotokoll, Version 4 (TCP/IPv4) → Eigenschaften → DNS‑Server manuell eintragen. Nur zur Diagnose.

- Keine Default‑Route nach Verbindung: `route print` prüfen. VPN‑Adapter deaktivieren/aktivieren oder VPN‑Client neu verbinden. Bei Unternehmens‑VPN IT informieren.

- Kill Switch blockiert alle Verbindungen: Kill Switch testweise deaktivieren, verbinden und prüfen; danach wieder aktivieren.

---

## Wann Sie den Anbieter / die IT kontaktieren

- Mehrere Geräte betroffen oder Problem bleibt nach Neustart/Adapter‑Neuinstallation bestehen → Anbieter/Netzwerk‑Provider kontaktieren.
- Auf verwalteten Geräten: Vor Ausführung von `netsh`‑/Reset‑Kommandos IT kontaktieren.

---

## FAQ

1) Warum zeigt Windows 11 "VPN verbunden", aber Webseiten laden nicht?

- Der Tunnel kann auf Ebene 2/3 aufgebaut sein (Authentifizierung erfolgreich), aber DNS‑ oder Routing‑Einträge fehlen oder der VPN‑Server erlaubt kein NAT/HTTP‑Forwarding. Prüfen Sie `nslookup` und `route print`.

2) Kann ich `netsh winsock reset` bedenkenlos ausführen?

- Nein. `netsh winsock reset` kann Netzwerkstack‑Probleme beheben, setzt aber benutzerdefinierte Netzwerkeinstellungen zurück. Auf verwalteten Geräten vorher IT kontaktieren und einen Wiederherstellungspunkt anlegen.

3) Mein VPN‑Client zeigt "Kill Switch aktiviert" — blockiert das Internet komplett?

- Ja: Ein Kill Switch soll Leaks verhindern, indem er den Verkehr blockiert, solange der Tunnel nicht als sicher gilt. Deaktivieren Sie ihn nur kurz zur Diagnose; prüfen Sie ansonsten die VPN‑Einstellungen.

4) Was zeigt `nslookup` an und wie nutze ich es?

- `nslookup` zeigt den aktuell verwendeten DNS‑Server und die aufgelösten IP‑Adressen. Beispiel: `nslookup www.example.com` oder `nslookup www.example.com 1.1.1.1` (fragt Cloudflare direkt).

5) Darf ich DNS/Adapter/`netsh` auf einem Firmen‑Laptop ändern?

- Auf Managed Devices nur nach Rücksprache mit der IT. Viele Einstellungen sind per Gruppenrichtlinie geschützt.

6) Ping funktioniert, aber Browser nicht — was nun?

- Ping zeigt IP‑Erreichbarkeit, nicht aber DNS oder TLS/HTTP. Prüfen Sie `nslookup`, testen Sie HTTPS per `curl`/PowerShell und prüfen Sie Proxy‑/Firewall‑Einstellungen.

7) Wann sollte ich meinen VPN‑Anbieter oder die IT kontaktieren?

- Wenn mehrere Geräte betroffen sind, ein anderer Server funktioniert oder nach den Basis‑Diagnosen keine Besserung eintritt. Auf verwalteten Geräten IT zuerst kontaktieren.

---

## Nützliche Befehle (Kurzreferenz)

- `ping 8.8.8.8 -n 4`
- `nslookup www.example.com`
- `nslookup www.example.com 1.1.1.1`
- `route print`
- `ipconfig /release`
- `ipconfig /renew`
- `ipconfig /flushdns`
- `ipconfig /registerdns`
- `netsh winsock reset`
- `netsh int ip reset`
- `curl -I https://www.example.com` oder PowerShell: `Invoke-WebRequest -Uri 'https://www.example.com' -Method Head`

---

## Verwandte Anleitungen

- /article/vpn-connected-but-no-internet-windows-11/
- /article/vpn-connected-but-websites-wont-load/
- /article/vpn-blocks-local-network-devices-windows-11/
- /article/vpn-kills-wifi-connection/
- /article/vpn-connected-but-printer-not-working/

---

## Quellen

- Microsoft Learn: ipconfig (DE) — https://learn.microsoft.com/de-de/windows-server/administration/windows-commands/ipconfig
- Microsoft Learn: netsh (DE) — https://learn.microsoft.com/de-de/windows-server/administration/windows-commands/netsh
- Microsoft Support (Windows Hilfe & Problembehandlung) — https://support.microsoft.com/de-de

---

## Redaktionelle Hinweise

- Zielgruppe: Endanwender in Deutschland, Österreich und der deutschsprachigen Schweiz. Unterschied Privatgerät vs. verwaltetes Gerät wird deutlich gemacht.
- Ton: Sachlich, handlungsorientiert. Keine Versprechungen zur Anonymität.
- Sicherheit: Klare Hinweise zu Risiken von `netsh`/Reset, Wiederherstellungspunkt empfohlen.
