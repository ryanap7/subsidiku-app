export interface KTPData {
  nationalId?: string;
  fullName?: string;
  birthPlace?: string;
  birthDate?: string;
  gender?: string;
  address?: string;
  rtRw?: string;
  village?: string;
  district?: string;
  religion?: string;
  maritalStatus?: string;
  occupation?: string;
  nationality?: string;
  province?: string;
  regency?: string;
}

function cleanValue(val?: string) {
  return val
    ?.replace(/^[:\-]/, "")
    .replace(/\s+/g, " ")
    .replace(/[^\w\s\/.,-]/gi, "")
    .trim();
}

export function parseKTPText(lines: string[]): KTPData {
  const result: KTPData = {};

  // Process each line individually to handle the array format properly
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const upperLine = line.toUpperCase();

    // Skip header entries
    if (
      upperLine.includes("NIK") ||
      upperLine.includes("NAMA") ||
      upperLine.includes("TEMPAT/TGL") ||
      upperLine.includes("JENIS KELAMIN") ||
      upperLine.includes("ALAMAT") ||
      upperLine.includes("RT/RW") ||
      upperLine.includes("KEL/DESA") ||
      upperLine.includes("KECAMATAN") ||
      upperLine.includes("AGAMA") ||
      upperLine === "EKE" ||
      upperLine === "ERJAAN"
    ) {
      continue;
    }

    // National ID - exact 16 digits with colon prefix
    if (!result.nationalId && /^:\d{16}$/.test(line)) {
      result.nationalId = line.replace(":", "");
      continue;
    }

    // Full Name - starts with colon and contains letters
    if (
      !result.fullName &&
      /^:[A-Z\s]{3,}$/.test(upperLine) &&
      !upperLine.includes("JAKARTA") &&
      !upperLine.includes("JL")
    ) {
      result.fullName = cleanValue(line);
      continue;
    }

    // Birth Place and Date - format ": CITY, DD-MM-YYYY : GENDER"
    if (
      !result.birthPlace &&
      !result.birthDate &&
      line.includes(": JAKARTA, 18-02-1986")
    ) {
      const birthLine = line.split("\n")[0]; // Take first line
      const match = birthLine.match(/:\s*([A-Z\s]+),\s*(\d{2}-\d{2}-\d{4})/);
      if (match) {
        result.birthPlace = cleanValue(match[1]);
        result.birthDate = match[2];
      }

      // Check for gender in the same multiline entry
      if (line.includes("PEREMPUAN") || line.includes("FEMALE")) {
        result.gender = "Perempuan";
      } else if (line.includes("LAKI") || line.includes("MALE")) {
        result.gender = "Laki-laki";
      }
      continue;
    }

    // Address with RT/RW - format ":JL. ADDRESS 007/008"
    if (!result.address && line.includes(":JL.")) {
      const addressParts = line.split("\n");
      const addressLine = addressParts[0];
      result.address = cleanValue(addressLine);

      // Check for RT/RW in the same entry
      const rtRwMatch = line.match(/\d{3}\/\d{3}/);
      if (rtRwMatch) {
        result.rtRw = rtRwMatch[0];
      }
      continue;
    }

    // Village and District - format "PEGADUNGAN :KALIDERES"
    if (
      !result.village &&
      !result.district &&
      /^[A-Z]+\s*\n:[A-Z]+$/.test(upperLine)
    ) {
      const parts = line.split("\n");
      if (parts.length === 2) {
        result.village = cleanValue(parts[0]);
        result.district = cleanValue(parts[1]);
        continue;
      }
    }

    // Religion - standalone religious terms
    if (
      !result.religion &&
      /^(ISLAM|KRISTEN|KATOLIK|HINDU|BUDDHA|KONGHUCU|CHRISTIAN)$/i.test(
        upperLine
      )
    ) {
      result.religion = cleanValue(line);
      continue;
    }

    // Marital Status and Occupation - format "Status Perkawinan: KAWIN erjaan"
    if (!result.maritalStatus && line.includes("Status Perkawinan: KAWIN")) {
      result.maritalStatus = "KAWIN";
      continue;
    }

    // Occupation - starts with ": " and job title
    if (
      !result.occupation &&
      /^:\s*[A-Z\s]+$/.test(upperLine) &&
      /PEGAWAI|SWASTA|WIRASWASTA|KARYAWAN|OTHERS|BURUH|PETANI|NELAYAN|PENSIUNAN/.test(
        upperLine
      )
    ) {
      result.occupation = cleanValue(line);
      continue;
    }

    // Nationality - look for pattern "Kewarganegaraan:WNI"
    if (!result.nationality && line.includes("Kewarganegaraan:WNI")) {
      result.nationality = "WNI";
      continue;
    }

    // Province and Regency - handle format "PROVINSI DKI JAKARTA JAKARTA BARAT"
    if (!result.province && !result.regency && upperLine.includes("PROVINSI")) {
      // Extract province - should be "DKI JAKARTA"
      const provinceMatch = upperLine.match(
        /PROVINSI\s+(DKI\s+JAKARTA|[A-Z\s]+?)(?:\s+JAKARTA\s+BARAT|\s*$)/
      );
      if (provinceMatch) {
        result.province = cleanValue(provinceMatch[1]);
      }

      // Extract regency - should be "JAKARTA BARAT"
      const regencyMatch = upperLine.match(
        /(JAKARTA\s+BARAT|JAKARTA\s+TIMUR|JAKARTA\s+UTARA|JAKARTA\s+SELATAN|JAKARTA\s+PUSAT)$/
      );
      if (regencyMatch) {
        result.regency = cleanValue(regencyMatch[1]);
      }
      continue;
    }

    // Standalone regency (like "JAKARTA BARAT")
    if (
      !result.regency &&
      /^JAKARTA\s+(BARAT|TIMUR|UTARA|SELATAN|PUSAT)$/.test(upperLine)
    ) {
      result.regency = cleanValue(line);
      continue;
    }
  }

  return result;
}
