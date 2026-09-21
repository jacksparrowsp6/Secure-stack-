---
title: "DNS-Leak trotz VPN: Prüfen, verstehen und sicher beheben"
description: "DNS-Leak trotz VPN? Prüfe Resolver, IPv6, Browser-DNS und VPN-Einstellungen, ohne vorschnell Datenschutz oder Internetzugang zu verschlechtern."
slug: dns-leak-trotz-vpn-pruefen-beheben
locale: de
category: "VPN-Datenschutz"
primaryKeyword: "DNS-Leak trotz VPN"
secondaryKeywords: "DNS Leak VPN prüfen | DNS-Leak trotz VPN beheben | VPN DNS Leak Windows 11 | DNS-Anfragen gehen nicht durch VPN | IPv6 Leak trotz VPN | WebRTC Leak und DNS Leak Unterschied"
publishedAt: "2026-09-21"
updatedAt: "2026-09-21"
author: "SecureStack Hub Redaktion"
reviewer: "Native German Technical Review"
translationMode: native-localization
---

# DNS-Leak trotz VPN: Prüfen, verstehen und sicher beheben

## Kurzantwort

Ein "DNS‑Leak trotz VPN" bedeutet: Deine DNS‑Anfragen (also die Abfragen, welche Domain zu welcher IP gehört) werden nicht durch den VPN‑Tunnel geleitet, sondern an einen anderen DNS‑Resolver (häufig den deines Internetanbieters) geschickt. Dadurch kann der ISP oder der Betreiber des DNS‑Resolvers erkennen, welche Domains du aufrufst – selbst wenn der eigentliche Webverkehr über das VPN läuft. Das ist ein Datenschutzrisiko, aber kein Beweis für automatische Identität oder Anonymität. Prüfe systematisch: Browser, Betriebssystem, VPN‑Client, IPv6 und Router. Behebe Probleme schrittweise und dokumentiere jede Änderung, damit du sie bei Bedarf zurückrollen kannst.

## Wieso das Thema wichtig ist

DNS‑Anfragen geben Aufschluss darüber, welche Webseiten oder Dienste ein Gerät anfragt. Selbst wenn die sichtbare öffentliche IPv4‑Adresse durch ein VPN ersetzt wird, können DNS‑Anfragen Rückschlüsse auf Surfverhalten und ungefähreren Standort erlauben. Das ist relevant für Privatsphäre, Tracking, Netzwerkauswertung und gegebenenfalls für Geo‑Beschränkungen. Es ist wichtig zu betonen: Ein behobener DNS‑Leak erhöht den Datenschutz, ersetzt aber keine vollständige Anonymität.

## Wichtige Begriffe (kurz und getrennt)

- DNS (Domain Name System): Ein verteiltes System, das Domainnamen in IP‑Adressen übersetzt (siehe RFC 1035).
- DNS‑Resolver: Der Server, der die Namensauflösung vornimmt. Das kann ein ISP‑Resolver, ein öffentlicher Resolver (z. B. Cloudflare/Google) oder ein Resolver des VPN‑Anbieters sein.
- DNS‑Leak: Situation, in der DNS‑Anfragen außerhalb des VPN‑Tunnels an einen anderen Resolver gehen.
- IP‑Leak: Die tatsächliche öffentliche IP‑Adresse deines Geräts ist sichtbar, obwohl ein VPN aktiv sein sollte.
- IPv6‑Leak: IPv6‑Pakete oder DNS‑Anfragen über IPv6 umgehen den Tunnel, wenn das VPN nur IPv4 routet oder IPv6 nicht abdeckt.
- WebRTC‑Leak: Browserfunktionen (STUN/ICE) können lokale oder öffentliche IP‑Adressen preisgeben; das ist unabhängig von DNS‑Lecks.

## Symptome eines DNS‑Leaks

- Ein DNS‑Leak‑Test zeigt DNS‑Resolver, die zu deinem ISP gehören, obwohl die sichtbare IP die des VPN‑Servers ist.
- Geo‑abhängige Inhalte zeigen weiterhin deinen realen Standort, obwohl die IP-Adresse des VPNs angezeigt wird.
- Mehrere Leak‑Testseiten geben unterschiedliche Ergebnisse – transient auftretende Leaks sind möglich.

## Häufige Ursachen (geordnet nach Auftretenshäufigkeit)

1. Browser‑seitiges Secure DNS (DoH/DoT) oder ein fest eingestellter DoH‑Provider, der außerhalb des VPN angesprochen wird.
2. IPv6 wird nicht vom VPN geroutet: IPv6‑Traffic und DNS über IPv6 laufen außerhalb des Tunnels.
3. Split‑Tunneling ist aktiviert und leitet DNS‑Anfragen außerhalb.
4. VPN‑Client ist falsch konfiguriert oder bietet keine DNS‑Leak‑Protection.
5. Router/Netzwerk erzwingt oder „hijackt“ DNS (transparent proxy, Port‑53‑Weiterleitung).
6. Lokale statische DNS‑Einträge oder DNS‑Cache, die die Auflösung außerhalb des Tunnels erzwingen.

## Sichere, wiederholbare Diagnose — von risikoarm zu eingreifend

## Vorbereitung

- Notiere: VPN‑Anbieter und -Serverstandort, Betriebssystem (z. B. Windows 11, macOS, Linux‑Distro), Browser und Router‑Modell. Mache Screenshots oder Notizen der Testergebnisse.
- Schließe unnötige Tabs/Anwendungen.
- Verwende für Tests vorzugsweise ein Gerät, bei dem du Konfigurationsänderungen vornehmen darfst.

Schritt 1 — Basischecks (risikoarm)

1. IP prüfen: Aktiviere das VPN, wähle einen Server und rufe eine IP‑Check‑Seite auf, z. B. https://ipleak.net/ oder https://whatismyip.akamai.com/. Notiere die dort angezeigte IPv4/IPv6.
2. DNS‑Leak‑Test: Benutze mindestens zwei unterschiedliche Dienste, z. B. https://dnsleaktest.com/ und https://ipleak.net/. Diese zeigen, welche DNS‑Resolver aktuell antworten.
3. Interpretation: Wenn die sichtbare IP die des VPN ist, aber die DNS‑Resolver deinen ISP nennen, liegt ein DNS‑Leak vor.

Schritt 2 — Browser prüfen (niedriges Eingriffslevel)

- Teste mit einem zweiten Browser oder im privaten/Inkognito‑Modus ohne Erweiterungen.
- Prüfe Secure‑DNS‑Einstellungen:
  - Firefox: Einstellungen → Allgemein → Netzwerk‑Einstellungen → DNS über HTTPS. Informationen: Mozilla Support.
  - Chrome/Edge: Einstellungen → Sicherheit → Sichere DNS (DoH).
- Deaktiviere temporär DoH/„Sichere DNS“ im Browser und wiederhole den DNS‑Test.
- WebRTC prüfen: Leak‑Seiten zeigen oft WebRTC‑Lecks; oder in Firefox in about:config den Wert "media.peerconnection.enabled" betrachten (Achtung: Änderungen beeinflussen WebRTC‑Funktionalität). MDN WebRTC‑Dokumentation erklärt Hintergründe.

Warum: Browser, die DoH/DoT direkt an einen externen DoH‑Provider schicken, können DNS‑Auflösung außerhalb des VPN verursachen – das ist kein Fehler des VPNs per se, sondern eine Konfigurationsangelegenheit.

Schritt 3 — Betriebssystem / lokale Tools prüfen

- Windows: In der Eingabeaufforderung verwenden: nslookup example.com
  - Das Ergebnis zeigt dir den aktuell benutzten Resolver. Alternativ PowerShell: Resolve‑DnsName example.com
- Linux/macOS: dig example.com oder dig @resolver example.com (dig ist in den meisten Distributionen/Tools verfügbar).
- Prüfe die Netzwerkkarteneinstellungen auf statische DNS‑Einträge. Entferne diese oder setze auf Automatisch (DHCP), damit der VPN‑Client die Kontrolle übernehmen kann.

Schritt 4 — VPN‑Client‑Einstellungen

- Suche nach „DNS Leak Protection“, „Use VPN DNS“ oder ähnlichen Optionen und aktiviere sie.
- Deaktiviere temporär Split‑Tunneling, falls aktiviert, und teste erneut.
- Wechsle bei Bedarf das VPN‑Protokoll (Beispiele: OpenVPN ↔ WireGuard), teste erneut. Unterschiedliche Implementationen handhaben DNS unterschiedlich.

Schritt 5 — IPv6 prüfen

- Viele VPNs routen nur IPv4. Prüfe auf https://ipleak.net/, ob eine IPv6‑Adresse angezeigt wird.
- Ist eine IPv6‑Adresse sichtbar, dann läuft IPv6 außerhalb des Tunnels (IPv6‑Leak). Kurzfristiger Workaround: IPv6 am Gerät deaktivieren; langfristig ist eine VPN‑Lösung mit vollständigem IPv6‑Support sinnvoll.
- Hinweis: IPv6 deaktivieren kann Funktionen und Performance beeinträchtigen (z. B. bestimmte Peer‑to‑Peer‑Dienste). Deshalb: vorher dokumentieren und bei Bedarf zurücksetzen.

Schritt 6 — Router / Netzwerk prüfen (eingreifend)

- Teste das VPN in einem anderen Netzwerk (z. B. Handy‑Hotspot). Wenn das Leak dort nicht auftritt, ist wahrscheinlich der Router oder das lokale Netz der Auslöser.
- Prüfe Router‑DNS‑Einstellungen und ob der Router Port‑53‑Anfragen an den ISP weiterleitet. Manche ISP‑Router nutzen DNS‑Interception.
- Für Heimnetz: Firmware‑UI des Routers prüfen oder eine alternative Firmware (nur wenn du weißt, was du tust) in Betracht ziehen. Alternativ: Router‑seitiger VPN‑Client (wenn verfügbar) sorgt dafür, dass alle Geräte inklusive DNS über den Tunnel laufen.

Schritt 7 — Cross‑Checks und Wiederholung

- Nutze mehrere Leak‑Seiten, teste mit mehreren VPN‑Servern (unterschiedliche Länder) und mehreren Geräten.
- Führe Tests zyklisch nach Software‑Updates, Serverwechseln oder Änderung von Einstellungen durch.

## Konkrete, sichere Reparaturmaßnahmen (geordnet nach Eingriffsgrad)

1) Browser‑Ebene (geringstes Risiko)

- Deaktiviere Browser‑DoH/DoT, falls er externe Provider ansteuert, oder konfiguriere ihn so, dass er denselben Resolver wie das VPN nutzt, sofern der Browser diese Option bietet.
- WebRTC: In Browsern WebRTC einschränken oder nur in vertrauenswürdigen Kontexten erlauben; Erweiterungen zur Vermeidung von WebRTC‑IP‑Lecks nur aus vertrauenswürdigen Quellen installieren.

2) VPN‑Client (mittleres Risiko)

- Aktiviere DNS‑Leak‑Schutz und deaktiviere Split‑Tunneling, wenn du nicht genau weisst, welche Anwendungen ausgenommen werden.
- Falls dein VPN IPv6 nicht routet, nutze die empfohlene Einstellung des Anbieters (manche bieten Anleitungen zum sicheren Deaktivieren von IPv6 oder zur Nutzung von IPv6‑tauglichen Servern).

3) Betriebssystem / Adapter (mittleres bis hohes Risiko)

- Entferne statische DNS‑Einträge in der Netzwerkkartenkonfiguration.
- Als fortgeschrittene Maßnahme: Firewall‑Regeln einrichten, um ausgehende DNS‑Anfragen an Port 53 außerhalb des Tunnels zu blockieren — nur für erfahrene Nutzer und mit Rückfallplan.

4) Router / Infrastruktur (höheres Risiko)

- Deaktiviere DNS‑Weiterleitung/-Interception, sofern möglich.
- Installiere einen Router‑basierten VPN‑Client, wenn du möchtest, dass alle Geräte inklusive DNS über den Tunnel laufen (erfordert passende Hardware und Kenntnisse).

Sicherheits‑ und Rollback‑Hinweise

- Notiere vorher alle Einstellungen (Screenshots, Textdateien). Mach nach jeder Änderung einen Test und notiere das Ergebnis.
- Ändere nur eine Einstellung pro Testdurchlauf, damit du die Ursache klar identifizieren kannst.
- Sei vorsichtig mit Firewall‑Regeln oder Router‑Firmware‑Änderungen — falsche Konfigurationen können Internetzugang oder lokale Dienste unterbrechen.

## Interpretation der Testergebnisse — was Drittanbieter‑Tests aussagen (und was nicht)

- Leak‑Checker zeigen immer nur das, was zu dem Zeitpunkt vom getesteten Gerät/Browser aus sichtbar ist. Sie sind momentane Snapshots, keine umfassende Sicherheitsprüfung.
- Unterschiedliche Leak‑Checker verwenden unterschiedliche Methoden und Endpunkte; vergleiche Ergebnisse mehrerer Dienste.
- Drittanbieter‑Leak‑Seiten sehen zwangsläufig die Testanfragen — das heißt, sie könnten diese Daten theoretisch protokollieren. Lies deshalb deren Datenschutz‑/Logging‑Regeln, wenn dir das wichtig ist.
- Ein Eintrag eines öffentlichen Resolvers (z. B. Cloudflare oder Google) in einem Test bedeutet nicht automatisch, dass die Verwendung „privater“ ist. Der Betreiber dieses Resolvers sieht die Anfragen; das kann in bestimmten Fällen weniger oder mehr vertrauenswürdig sein — je nach Datenschutzhinweisen des Anbieters.
- Ein einzelner Resolver‑Eintrag bedeutet nicht unbedingt permanentes Logging oder Datenteilung. Zur Beurteilung der Privatsphäre sind die Datenschutzrichtlinien und technische Implementationen (z. B. DoH/DoT, Query Minimization) relevant.

## Unterschiede: DNS‑Leak vs. IP‑Leak vs. IPv6‑Leak vs. WebRTC‑Leak (konkret)

- DNS‑Leak: Nur die Namensauflösung läuft außerhalb des Tunnels; der eigentliche Datenverkehr (HTTP/HTTPS) kann trotzdem über das VPN gehen.
- IP‑Leak: Deine echte öffentliche IP (IPv4/IPv6) ist direkt sichtbar — das ist in der Regel schwerwiegender für die Identifizierbarkeit.
- IPv6‑Leak: IPv6‑Pakete oder DNS über IPv6 umgehen den Tunnel, weil dieser nur IPv4 routet oder IPv6 nicht implementiert ist.
- WebRTC‑Leak: Browser‑Mechanik (STUN/ICE) kann lokale/private sowie öffentliche IP‑Adressen offenbaren. Das steht technisch getrennt von DNS‑Lecks.

## FAQ

1) Mein DNS zeigt den ISP, aber meine IP ist die des VPN. Ist das schlimm?
Antwort: Es ist ein Datenschutzproblem, weil der ISP sehen kann, welche Domains du abfragst. Ob das "schlimm" ist, hängt vom individuellen Bedrohungsmodell ab. Für viele alltägliche Anwendungen ist es unerwünscht, für andere Szenarien reicht es womöglich aus. Folge den Diagnose‑ und Reparaturschritten oben.

2) Ist das Deaktivieren von IPv6 die beste Lösung?
Antwort: Kurzfristig kann das eine sinnvolle Maßnahme sein, wenn dein VPN kein IPv6 routet. Langfristig ist es besser, einen VPN‑Anbieter oder eine Konfiguration zu nutzen, die IPv6 vollständig unterstützt. Dauerhaftes Abschalten von IPv6 kann Funktionen beeinträchtigen.

3) Lösen öffentliche DNS‑Server wie 1.1.1.1 oder 8.8.8.8 das Problem?
Antwort: Nein, nicht automatisch. Diese Resolver können Leistung und — je nach Implementierung — Verschlüsselung (DoH/DoT) bieten, aber der jeweilige Betreiber sieht deine Anfragen. Außerdem können Router/ISP Port‑53‑Anfragen umleiten. Es ist kein pauschaler Datenschutz‑Fix.

4) Wie hängt Secure DNS (DoH/DoT) mit VPN zusammen?
Antwort: DoH/DoT verschlüsseln DNS‑Anfragen zwischen deinem Client und dem DoH/DoT‑Endpoint. Wenn der Browser oder das System aber direkt einen externen DoH‑Provider anspricht, kann diese Kommunikation außerhalb des VPN laufen. Ziel ist, Browser und VPN so zu konfigurieren, dass DNS‑Anfragen ebenfalls über den Tunnel gehen oder dass der ausgewählte DoH/DoT‑Provider deinen Datenschutzanforderungen entspricht.

5) Wie teste ich WebRTC‑Leaks ohne Erweiterungen?
Antwort: Es gibt Leak‑Seiten, die WebRTC‑Lecks anzeigen (z. B. ipleak.net). Alternativ kannst du in Browser‑Einstellungen die WebRTC‑IP‑Handhabung einschränken (z. B. Firefox) oder WebRTC komplett deaktivieren — das kann jedoch Web‑Apps beeinträchtigen, die WebRTC benötigen.

6) Ich arbeite in einem Firmennetz — kann der Administrator DNS erzwingen?
Antwort: Ja. Unternehmensnetzwerke können DNS‑Server zentral vorgeben, Proxying aktivieren oder DNS‑Filtering einsetzen. In solchen Umgebungen reicht ein Endgerät‑VPN manchmal nicht aus; sprich mit dem IT‑Team über gewünschte Lösungen.

7) Muss ich bei jedem Serverwechsel testen?
Antwort: Es ist empfehlenswert, kurz zu prüfen, besonders wenn du einen anderen Servertyp oder Standort wählst. Unterschiedliche Server können unterschiedlich konfiguriert sein.

## Praktische Beispiele für Kommandos (kurz)

- Windows CMD: nslookup example.com
- Windows PowerShell: Resolve‑DnsName example.com
- macOS / Linux (Terminal): dig example.com
- Test IPv6 sichtbar: https://ipleak.net/ (zeigt IPv4/IPv6)

## Quellen

- RFC 1035 — Domain Names - Implementation and Specification: https://datatracker.ietf.org/doc/html/rfc1035
- RFC 8484 — DNS Queries over HTTPS (DoH): https://datatracker.ietf.org/doc/html/rfc8484
- RFC 7858 — DNS over TLS (DoT): https://datatracker.ietf.org/doc/html/rfc7858
- Cloudflare 1.1.1.1 Dokumentation: https://developers.cloudflare.com/1.1.1.1/
- Google Public DNS Informationen: https://developers.google.com/speed/public-dns
- OpenVPN: https://openvpn.net/
- WireGuard: https://www.wireguard.com/
- MDN Web Docs — WebRTC: https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API
- Microsoft Docs — Netzwerk & DNS (Windows): https://learn.microsoft.com/windows
- DNS‑Leak‑Test: https://dnsleaktest.com/
- IP‑/WebRTC‑Leak‑Test: https://ipleak.net/

## Hinweis zu Quellen und Testbegrenzungen

- Leak‑Checker liefern Momentaufnahmen; sie ersetzen keine tiefergehende Sicherheits‑ oder Forensik‑Analyse.
- Leak‑Testseiten sehen selbst deine Testanfragen; das kann bei sehr sensiblen Szenarien relevant sein.
- Datenschutz‑Eigenschaften hängen vom technischen Design (DoH/DoT, Query Minimization) und den Logging‑Regeln des jeweiligen DNS‑ oder VPN‑Anbieters ab.

## Weiteres Vorgehen

Wenn du möchtest, führe ich die Diagnose Schritt für Schritt anhand deiner konkreten Umgebung durch (OS‑Version, VPN‑Anbieter/-Client, Router‑Modell, Browser). Ich begleite dich durch Tests und sichere Rücksetzschritte.

## Verwandte Anleitungen

- /article/vpn-connected-but-no-internet-windows-11/
- /article/vpn-connected-but-websites-wont-load/
- /article/vpn-blocks-local-network-devices-windows-11/
- /article/vpn-kills-wifi-connection/
- /article/vpn-connected-but-printer-not-working/
