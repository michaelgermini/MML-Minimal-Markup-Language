# 🚀 Internet-Draft: Minimal Markup Language (MML)

## A Minimal Markup Language for Constrained Environments

**Document Stream:** Independent Submission  
**Intended Status:** Informational  
**Authors:** MML Working Group  
**Date:** November 15, 2025  

---

## Abstract

This document specifies the Minimal Markup Language (MML), a lightweight markup language designed for resource-constrained environments. MML provides a simple, robust, and efficient way to represent structured text content with minimal overhead.

MML is particularly well-suited for:
- Emergency communications
- IoT device messaging
- Radio transmission protocols
- Long-term data archiving
- Constrained network environments

## Table of Contents

1. [Introduction](#1-introduction)
2. [Requirements Language](#2-requirements-language)
3. [MML Syntax Specification](#3-mml-syntax-specification)
4. [Core Features](#4-core-features)
5. [Extensions](#5-extensions)
6. [MML Compressed Format (MMLC)](#6-mml-compressed-format-mmlc)
7. [Security Considerations](#7-security-considerations)
8. [IANA Considerations](#8-iana-considerations)
9. [Implementation Status](#9-implementation-status)
10. [References](#10-references)
11. [Acknowledgments](#11-acknowledgments)

---

## 1. Introduction

### 1.1 Motivation

Existing markup languages like XML, JSON, and HTML are often too verbose and resource-intensive for constrained environments. MML was designed to address these limitations while maintaining essential functionality for structured content representation.

Key design goals:
- **Simplicity**: Easy to parse and generate
- **Robustness**: Resistant to transmission errors
- **Efficiency**: Minimal resource requirements
- **Extensibility**: Domain-specific extensions support

### 1.2 Use Cases

#### 1.2.1 Emergency Communications
MML enables reliable transmission of critical information in emergency situations:

```
T:EMERGENCY REPORT
M:ID|INC-2025-001
M:Priority|CRITICAL
M:Location|45.234N 2.456E

H:SITUATION
P:Forest fire reported
M:Area|450 hectares
M:Wind|25 km/h NNE

H:RESOURCES REQUIRED
P:3 helicopters + 2 water bombers
P:45 firefighters on ground
```

#### 1.2.2 IoT Device Messaging
Small devices can efficiently transmit sensor data:

```
T:SENSOR REPORT
M:Device|TMP-001
M:Location|Warehouse-A
M:Timestamp|2025-01-15T10:30:00Z

M:Temperature|23.5°C
M:Humidity|65%
M:Battery|87%
```

#### 1.2.3 Radio Transmission
MML's robustness makes it suitable for error-prone radio links, with built-in Morse code optimization.

---

## 2. Requirements Language

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in BCP 14 [RFC2119] [RFC8174] when, and only when, they appear in all capitals, as shown here.

---

## 3. MML Syntax Specification

### 3.1 Basic Structure

An MML document consists of lines, where each line contains at most one tag. The basic syntax is:

```
TAG:CONTENT
```

#### 3.1.1 Character Encoding
MML documents MUST be encoded in UTF-8 [RFC3629]. All Unicode characters are supported.

#### 3.1.2 Line Endings
Both LF (\\n) and CRLF (\\r\\n) line endings MUST be accepted by parsers.

### 3.2 Tag Format

Tags MUST:
- Be in uppercase letters
- Be followed immediately by a colon (:)
- Have content starting immediately after the colon

```
VALID: T:Document Title
VALID: M:Key|Value
INVALID: t:document title  // lowercase
INVALID: T :Document Title // space before colon
```

### 3.3 Core Tags

#### 3.3.1 Document Structure
- **T:** Document title (REQUIRED)
- **H:** Section heading
- **P:** Paragraph text

#### 3.3.2 Metadata and References
- **M:** Metadata (key|value format)
- **L:** Link (text|URL format)
- **IMG:** Image (description|URL format)

#### 3.3.3 Content Types
- **C:** Code block
- **Q:** Quote or note

---

## 4. Core Features

### 4.1 Document Title

Every MML document MUST begin with a title tag:

```
T:Emergency Incident Report
```

### 4.2 Metadata

Metadata provides additional information about the document or sections:

```
M:Author|John Doe
M:Created|2025-01-15T10:30:00Z
M:Priority|High
```

### 4.3 Sections and Content

Documents are organized into sections with headings and paragraphs:

```
H:Incident Description
P:A fire broke out in the warehouse at 2:15 AM.
P:The fire department was notified immediately.

H:Casualties
P:No injuries reported.
P:Building evacuated successfully.
```

### 4.4 Links and Media

Links and images use a text|URL format:

```
L:Official Documentation|https://example.com/docs
IMG:Aerial View|https://example.com/aerial.jpg
```

---

## 5. Extensions

### 5.1 Extension Mechanism

MML supports domain-specific extensions through prefixed tags:

```
MED:Diagnosis|Acute appendicitis
TECH:Version|2.1.0
SYS:CPU|i7-11700K
```

### 5.2 Extension Registration

Extensions SHOULD be registered and documented to avoid conflicts. The extension prefix MUST be 2-4 uppercase letters.

### 5.3 Standard Extensions

#### 5.3.1 Medical Extension (MED:)
For healthcare data:

```
MED:PatientID|P2025001
MED:BloodPressure|120/80
MED:HeartRate|72 bpm
```

#### 5.3.2 Technical Extension (TECH:)
For technical specifications:

```
TECH:OS|Ubuntu 22.04 LTS
TECH:RAM|16GB
TECH:Storage|512GB SSD
```

---

## 6. MML Compressed Format (MMLC)

### 6.1 Compression Algorithm

MMLC uses numeric coding to reduce document size:

```
ORIGINAL:
T:Sensor Report
M:Temperature|23.5°C

COMPRESSED:
1:Sensor Report
3:Temperature|23.5°C
```

### 6.2 Compression Ratio

Typical compression ratios:
- General documents: 40-60% size reduction
- Repetitive content: up to 70% reduction
- Unique content: 20-30% reduction

### 6.3 Implementation Requirements

MMLC parsers MUST be able to decompress MMLC documents back to standard MML format.

---

## 7. Security Considerations

### 7.1 Data Sanitization

MML parsers MUST sanitize input to prevent injection attacks. Content in MML documents SHOULD be treated as untrusted data.

### 7.2 Transmission Security

When transmitting MML documents over insecure channels, encryption SHOULD be used. MML itself does not provide encryption capabilities.

### 7.3 Resource Exhaustion

Implementations MUST protect against:
- Excessive memory usage from large documents
- CPU exhaustion from malicious parsing
- DoS attacks through resource consumption

### 7.4 Privacy Considerations

MML documents may contain sensitive information. Appropriate access controls and encryption SHOULD be implemented when handling sensitive data.

---

## 8. IANA Considerations

### 8.1 Media Type Registration

This document requests IANA to register the following media type:

**Type name:** application

**Subtype name:** mml

**Required parameters:** None

**Optional parameters:** charset (defaults to UTF-8)

**Encoding considerations:** 8-bit (UTF-8 encoded)

**Security considerations:** See Section 7

**Interoperability considerations:** MML is designed for broad interoperability

**Published specification:** This document

**Applications that use this media type:** Various markup and data exchange applications

**Fragment identifier considerations:** None

**Additional information:**
- **Magic number(s):** None
- **File extension(s):** .mml
- **Macintosh file type code(s):** None

**Person & email address to contact for further information:** MML Working Group <ietf@mml-lang.org>

**Intended usage:** COMMON

**Restrictions on usage:** None

**Author:** MML Working Group

**Change controller:** IETF

### 8.2 MMLC Media Type

**Type name:** application

**Subtype name:** mmlc

**Required parameters:** None

**Optional parameters:** None

**Encoding considerations:** binary

**Security considerations:** See Section 7

---

## 9. Implementation Status

### 9.1 Existing Implementations

#### 9.1.1 JavaScript Implementation
- **Status:** Complete
- **Location:** https://github.com/mml-lang/mml/tree/main/implementations/javascript
- **Coverage:** Full MML specification
- **License:** MIT

#### 9.1.2 Python Implementation
- **Status:** Complete
- **Location:** https://github.com/mml-lang/mml/tree/main/implementations/python
- **Coverage:** Full MML specification
- **License:** MIT

#### 9.1.3 C/C++ Implementation
- **Status:** Complete
- **Location:** https://github.com/mml-lang/mml/tree/main/implementations/cpp
- **Coverage:** Full MML specification + embedded optimizations
- **License:** MIT

#### 9.1.4 Rust Implementation
- **Status:** Complete
- **Location:** https://github.com/mml-lang/mml/tree/main/implementations/rust
- **Coverage:** Full MML specification + high performance
- **License:** MIT

#### 9.1.5 Go Implementation
- **Status:** Complete
- **Location:** https://github.com/mml-lang/mml/tree/main/implementations/go
- **Coverage:** Full MML specification + network services
- **License:** MIT

### 9.2 Validator and Tools

#### 9.2.1 Web Validator
- **Status:** Complete
- **Location:** https://validator.mml-lang.org
- **Features:** Real-time validation, conversion, compression

#### 9.2.2 CLI Tools
- **Status:** Complete
- **Location:** https://github.com/mml-lang/mml/tree/main/bin
- **Features:** Validation, conversion, compression, statistics

#### 9.2.3 VS Code Extension
- **Status:** Complete
- **Location:** https://marketplace.visualstudio.com/items?itemName=mml-lang.mml
- **Features:** Syntax highlighting, snippets, validation

### 9.3 Benchmarks and Performance

Comprehensive benchmarks are available at:
https://github.com/mml-lang/mml/tree/main/benchmarks

Key performance metrics:
- Parsing speed: 1-50ms depending on document size
- Memory usage: 5-50KB for typical documents
- Compression ratio: 40-60% size reduction

---

## 10. References

### 10.1 Normative References

[RFC2119] Bradner, S., "Key words for use in RFCs to Indicate Requirement Levels", BCP 14, RFC 2119, DOI 10.17487/RFC2119, March 1997.

[RFC3629] Yergeau, F., "UTF-8, a transformation format of ISO 10646", STD 63, RFC 3629, DOI 10.17487/RFC3629, November 2003.

[RFC4646] Phillips, A. and M. Davis, "Tags for Identifying Languages", BCP 47, RFC 4646, DOI 10.17487/RFC4646, September 2006.

[RFC8174] Leiba, B., "Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words", BCP 14, RFC 8174, DOI 10.17487/RFC8174, May 2017.

### 10.2 Informative References

[XML] Bray, T., Paoli, J., Sperberg-McQueen, C., Maler, E., and F. Yergeau, "Extensible Markup Language (XML) 1.0 (Fifth Edition)", W3C Recommendation, November 2008.

[JSON] Bray, T., Ed., "The JavaScript Object Notation (JSON) Data Interchange Format", RFC 8259, DOI 10.17487/RFC8259, December 2017.

[YAML] Ben-Kiki, O., Evans, C., and I. Net, "YAML Ain't Markup Language (YAML) Version 1.2", 3rd Edition, October 2021.

---

## 11. Acknowledgments

The authors would like to thank the MML community for their contributions, feedback, and support during the development of this specification.

Special thanks to:
- The emergency response organizations that provided real-world use cases
- The IoT device manufacturers who contributed performance requirements
- The open source community for implementation contributions
- The IETF community for guidance and review

---

## Authors' Addresses

MML Working Group
Email: ietf@mml-lang.org
Website: https://mml-lang.org

---

This document is an independent submission to the IETF. It is not the product of an IETF Working Group nor is it a standards track document. It has not been processed according to the IETF standards process.

Copyright (c) 2025 MML Working Group. All Rights Reserved.

This document and the information contained herein are provided on an "AS IS" basis and THE CONTRIBUTOR, THE ORGANIZATION HE/SHE REPRESENTS OR IS SPONSORED BY (IF ANY), THE INTERNET SOCIETY, THE IETF TRUST, AND THE INTERNET ENGINEERING TASK FORCE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTY THAT THE USE OF THE INFORMATION HEREIN WILL NOT INFRINGE ANY RIGHTS OR ANY IMPLIED WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.
